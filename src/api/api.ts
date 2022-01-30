import { OrderBook } from "../data/types";
import { DeltaResponseMessage, SnapshotResponseMessage, SubscriptionMessage } from "./messages";

export type Currency = "Bitcoin" | "Ethereum";
export type OrderBookData = SnapshotResponseMessage | DeltaResponseMessage;

const openMessage: SubscriptionMessage = { event: "subscribe", feed: "book_ui_1", product_ids: [] };
const closeMessage: SubscriptionMessage = { event: "unsubscribe", feed: "book_ui_1", product_ids: [] };
const maxLevelsCount = 15;

let socket: WebSocket;
let onDataUpdate: ((data: OrderBook) => void) | null = null;
let orderBookState: OrderBook | null = null;
let currentCurrency: Currency;

export function initialize(onNewData: (data: OrderBook) => void): Promise<void> {
  onDataUpdate = onNewData;
  return connect();
}

export async function connect(): Promise<void> {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return;
  }

  socket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

  return new Promise((resolve, reject) => {
    socket.onopen = (event) => {
      console.log("WS connected: ", event);
      resolve();
    };

    socket.onerror = (event) => {
      console.log("WS error: ", event);
      reject();
    };

    socket.onclose = (event) => {
      console.log("WS disconnect: ", event);
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        if (parsedData?.feed === "book_ui_1_snapshot" && parsedData?.bids && parsedData?.asks) {
          const snapshot = parsedData as SnapshotResponseMessage;

          if (snapshot.product_id === currencyToMessageProductId(currentCurrency)) {
            orderBookState = mapSnapshotToData(snapshot);
            onDataUpdate?.(orderBookState);
          }
        }

        if (parsedData?.feed === "book_ui_1" && parsedData?.bids && parsedData?.asks) {
          const delta = parsedData as DeltaResponseMessage;

          if (delta.product_id === currencyToMessageProductId(currentCurrency)) {
            orderBookState = mapDeltaToData(delta, orderBookState);
            onDataUpdate?.(orderBookState);
          }
        }
      } catch {
        // Something is wrong with server data
        // Log error
      }
    };
  });
}

export function disconnect(): void {
  socket.close();
}

export async function subscribe(currency: Currency): Promise<void> {
  currentCurrency = currency;

  if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
    await connect();
  }

  const message: SubscriptionMessage = { ...openMessage, product_ids: [currencyToMessageProductId(currency)] };
  socket.send(JSON.stringify(message));
}

export function unsubscribe(currency: Currency): void {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  const message: SubscriptionMessage = { ...closeMessage, product_ids: [currencyToMessageProductId(currency)] };
  socket.send(JSON.stringify(message));
}

const currencyToMessageProductId = (currency: Currency) => {
  switch (currency) {
    case "Bitcoin":
      return "PI_XBTUSD";
    case "Ethereum":
      return "PI_ETHUSD";
    default:
      throw new Error("Invalid currency");
  }
};

const mapSnapshotToData = (data: SnapshotResponseMessage) => {
  const book: OrderBook = {
    currency: currentCurrency,
    asks: [],
    bids: [],
    highestTotal: 0,
  };

  let bidsTotal = 0;
  data.bids.forEach((bid) => {
    const [price, size] = bid;
    bidsTotal += size;

    if (book.bids.length < maxLevelsCount) {
      book.bids.push({
        price,
        size,
        total: bidsTotal,
      });
    }
  });

  let asksTotal = 0;
  data.asks.forEach((ask) => {
    const [price, size] = ask;
    asksTotal += size;

    if (book.asks.length < maxLevelsCount) {
      book.asks.push({
        price,
        size,
        total: asksTotal,
      });
    }
  });

  book.highestTotal = bidsTotal > asksTotal ? bidsTotal : asksTotal;

  return book;
};

const mapDeltaToData = (data: DeltaResponseMessage, currentBook: OrderBook | null) => {
  if (!currentBook) {
    throw new Error("Book needs to be defined");
  }

  const book = { ...currentBook };

  data.bids.forEach((newBid) => {
    const [price, size] = newBid;

    const currentValueIndex = book.bids.findIndex((bid) => bid.price === price);

    if (currentValueIndex >= 0) {
      if (size === 0) {
        book.bids.splice(currentValueIndex, 1);
      } else {
        book.bids[currentValueIndex] = {
          size,
          price,
          total: 0,
        };
      }
    } else {
      if (size > 0) {
        book.bids.push({
          price,
          size,
          total: 0, // TODO,
        });
      }
    }
  });

  data.asks.forEach((newAsk) => {
    const [price, size] = newAsk;

    const currentValueIndex = book.asks.findIndex((ask) => ask.price === price);

    if (currentValueIndex >= 0) {
      if (size === 0) {
        book.asks.splice(currentValueIndex, 1);
      } else {
        book.asks[currentValueIndex] = {
          size,
          price,
          total: 0,
        };
      }
    } else {
      if (size > 0) {
        book.asks.push({
          price,
          size,
          total: 0, // TODO,
        });
      }
    }
  });

  book.bids = book.bids.sort((a, b) => b.price - a.price).slice(0, maxLevelsCount);
  book.asks = book.asks.sort((a, b) => a.price - b.price).slice(0, maxLevelsCount);

  let bidsTotal = 0;
  book.bids.forEach((bid) => {
    bidsTotal += bid.size;
    bid.total = bidsTotal;
  });

  let asksTotal = 0;
  book.asks.forEach((ask) => {
    asksTotal += ask.size;
    ask.total = asksTotal;
  });

  book.highestTotal = bidsTotal > asksTotal ? bidsTotal : asksTotal;

  return book;
};
