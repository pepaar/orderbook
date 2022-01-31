import { Currency, OrderBook } from "../../state/orderBookState";
import { DeltaResponseMessage, SnapshotResponseMessage } from "./orderBookModel";

const maxLevelsCount = 15;

export const currencyToMessageProductId = (currency: Currency) => {
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
  const book: OrderBook = {
    currency: messageProductIdToCurrency(data.product_id),
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

export const mapDeltaToData = (data: DeltaResponseMessage, currentBook: OrderBook | null) => {
  if (!currentBook) {
    throw new Error("Book needs to be defined");
  }

  const book: OrderBook = {
    currency: messageProductIdToCurrency(data.product_id),
    asks: currentBook.asks.map((ask) => ({ ...ask })),
    bids: currentBook.bids.map((bid) => ({ ...bid })),
    highestTotal: 0,
  };

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
          total: 0,
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
