import { OrderBook, Currency } from "../../../state/orderBook";
import { currencyToMessageProductId, mapDeltaToData, mapSnapshotToData } from "./orderBookMapping";
import { DeltaResponseMessage, SnapshotResponseMessage, SubscriptionMessage } from "./orderBookModel";

const webSocketUrl = "wss://www.cryptofacilities.com/ws/v1";
const openMessage: SubscriptionMessage = { event: "subscribe", feed: "book_ui_1", product_ids: [] };
const closeMessage: SubscriptionMessage = { event: "unsubscribe", feed: "book_ui_1", product_ids: [] };

let dataCallbacks: DataCallbacks | null = null;
let orderBookState: OrderBook | null = null;
let socket: WebSocket;

type DataCallbacks = {
  setNewOrderBook: (data: OrderBook) => void;
  currentCurrency: Currency;
};

export function initialize(callbacks: DataCallbacks): Promise<void> {
  dataCallbacks = callbacks;
  return connect();
}

export async function connect(): Promise<void> {
  if (socket?.readyState === WebSocket.OPEN) {
    return;
  }

  socket = new WebSocket(webSocketUrl);

  return new Promise<void>((resolve, reject) => {
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
        if (!dataCallbacks) {
          return;
        }

        const parsedData = JSON.parse(event.data);

        if (parsedData?.feed === "book_ui_1_snapshot" && parsedData?.bids && parsedData?.asks) {
          const snapshot = parsedData as SnapshotResponseMessage;

          if (snapshot.product_id === currencyToMessageProductId(dataCallbacks.currentCurrency)) {
            orderBookState = mapSnapshotToData(snapshot);
            dataCallbacks.setNewOrderBook(orderBookState);
          }
        }

        if (parsedData?.feed === "book_ui_1" && parsedData?.bids && parsedData?.asks) {
          const delta = parsedData as DeltaResponseMessage;

          if (delta.product_id === currencyToMessageProductId(dataCallbacks.currentCurrency)) {
            orderBookState = mapDeltaToData(delta, orderBookState);
            dataCallbacks.setNewOrderBook(orderBookState);
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
  socket?.close();
}

export async function subscribe(currency: Currency) {
  if (socket?.readyState === WebSocket.CLOSED || socket?.readyState === WebSocket.CLOSING) {
    await connect();
  }

  const message: SubscriptionMessage = { ...openMessage, product_ids: [currencyToMessageProductId(currency)] };
  socket?.send(JSON.stringify(message));
}

export function unsubscribe(currency: Currency) {
  if (socket?.readyState !== WebSocket.OPEN) {
    return;
  }

  const message: SubscriptionMessage = { ...closeMessage, product_ids: [currencyToMessageProductId(currency)] };
  socket.send(JSON.stringify(message));
}
