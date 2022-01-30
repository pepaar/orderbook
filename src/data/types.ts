import { Currency } from "../api/api";

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
