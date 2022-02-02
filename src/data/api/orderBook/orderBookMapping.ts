import { Currency, Order, OrderBook } from "../../../state/orderBook";
import { DeltaResponseMessage, SnapshotResponseMessage } from "./orderBookModel";

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

export const mapSnapshotToData = (data: SnapshotResponseMessage): OrderBook => {
  const bids = processSnapshotOrderInputArray(data.bids);
  const asks = processSnapshotOrderInputArray(data.asks);

  const book: OrderBook = {
    currency: messageProductIdToCurrency(data.product_id),
    highestTotal: 0,
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

  book.bids = book.bids.sort((a, b) => b.price - a.price);
  book.asks = book.asks.sort((a, b) => a.price - b.price);

  book.bids.reduce((total, bid) => {
    total += bid.size;
    bid.total = total;

    return total;
  }, 0);

  book.asks.reduce((total, ask) => {
    total += ask.size;
    ask.total = total;

    return total;
  }, 0);

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

    orders.push({
      price,
      size,
      total,
    });
  });

  return orders;
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
