import { Currency, Order, OrderBook } from "../../state/orderBookState";
import { DeltaResponseMessage, SnapshotResponseMessage } from "./orderBookModel";

const maxLevelsCount = 15;

export const currencyToMessageProductId = (currency: Currency): string => {
  switch (currency) {
    case "Bitcoin":
      return "PI_XBTUSD";
    case "Ethereum":
      return "PI_ETHUSD";
    default:
      throw new Error("Invalid currency");
  }
};

export const messageProductIdToCurrency = (productId: string): Currency => {
  switch (productId) {
    case "PI_XBTUSD":
      return "Bitcoin";
    case "PI_ETHUSD":
      return "Ethereum";
    default:
      throw new Error("Invalid productId");
  }
};

export const mapSnapshotToData = (data: SnapshotResponseMessage) => {
  const { orders: bids, total: bidsTotal } = processSnapshotOrderInputArray(data.bids);
  const { orders: asks, total: asksTotal } = processSnapshotOrderInputArray(data.asks);

  const book: OrderBook = {
    currency: messageProductIdToCurrency(data.product_id),
    highestTotal: bidsTotal > asksTotal ? bidsTotal : asksTotal,
    asks,
    bids,
  };

  return book;
};

export const mapDeltaToData = (data: DeltaResponseMessage, currentBook: OrderBook | null) => {
  if (!currentBook) {
    throw new Error("Current book needs to be defined!");
  }

  const book: OrderBook = {
    currency: messageProductIdToCurrency(data.product_id),
    asks: currentBook.asks.map((ask) => ({ ...ask })),
    bids: currentBook.bids.map((bid) => ({ ...bid })),
    highestTotal: 0,
  };

  processDeltaOrderInputArray(data.bids, book.bids);
  processDeltaOrderInputArray(data.asks, book.asks);

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

const processSnapshotOrderInputArray = (inputOrders: number[][]) => {
  let total = 0;
  const orders: Order[] = [];

  inputOrders.forEach((inputOrder) => {
    const [price, size] = inputOrder;

    if (price === undefined || size === undefined) {
      return;
    }

    total += size;

    if (orders.length < maxLevelsCount) {
      orders.push({
        price,
        size,
        total,
      });
    }
  });

  return { orders, total };
};

const processDeltaOrderInputArray = (inputOrders: number[][], currentOrders: Order[]) => {
  inputOrders.forEach((inputOrder) => {
    const [price, size] = inputOrder;

    if (price === undefined || size === undefined) {
      return;
    }

    const currentValueIndex = currentOrders.findIndex((order) => order.price === price);

    if (currentValueIndex >= 0) {
      if (size === 0) {
        currentOrders.splice(currentValueIndex, 1);
      } else {
        currentOrders[currentValueIndex] = {
          size,
          price,
          total: 0,
        };
      }
    } else {
      if (size > 0) {
        currentOrders.push({
          price,
          size,
          total: 0,
        });
      }
    }
  });
};
