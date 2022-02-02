import { atom, selector } from "recoil";

export type Currency = "Bitcoin" | "Ethereum";

export interface Order {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  currency: Currency;
  bids: Order[];
  asks: Order[];
  highestTotal: number;
}

export interface ConnectionState {
  isOnline: boolean;
  error: string | null;
}

export const orderBookState = atom<OrderBook | null>({
  key: "orderBook",
  default: null,
});

export const maxLevelsCountState = atom<number>({
  key: "maxLevelsCount",
  default: 15,
});

export const selectedCurrencyState = atom<Currency>({
  key: "currency",
  default: "Bitcoin",
});

export const connectionState = atom<ConnectionState>({
  key: "connectionState",
  default: {
    isOnline: true,
    error: null,
  },
});

export const topOfOrderBookState = selector<OrderBook | null>({
  key: "topOfOrderBook",
  get: ({ get }) => {
    const maxLevelsCount = get(maxLevelsCountState);
    const book = get(orderBookState);

    if (!book) {
      return null;
    }

    const asks = book.asks.slice(0, maxLevelsCount);
    const bids = book.bids.slice(0, maxLevelsCount);

    const asksTotal = asks[asks.length - 1]?.total ?? 0;
    const bidsTotal = bids[bids.length - 1]?.total ?? 0;
    const highestTotal = bidsTotal > asksTotal ? bidsTotal : asksTotal;

    const topOfBook: OrderBook = {
      currency: book.currency,
      asks,
      bids,
      highestTotal,
    };

    return topOfBook;
  },
});
