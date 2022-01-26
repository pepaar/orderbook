export interface Order {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: Order[];
  asks: Order[];
  highestTotal: number;
}
