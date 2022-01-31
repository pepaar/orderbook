import { atom } from "recoil";

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
