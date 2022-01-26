import { OrderBook } from "./types";

export const orderBookData: OrderBook = {
  bids: [
    { price: 1000, size: 50, total: 50 },
    { price: 1005, size: 100, total: 150 },
    { price: 1010.5, size: 1000, total: 1150 },
  ],
  asks: [
    { price: 1020, size: 30, total: 30 },
    { price: 1030, size: 500, total: 530 },
    { price: 10404.03, size: 250, total: 780 },
  ],
  highestTotal: 1150,
};
