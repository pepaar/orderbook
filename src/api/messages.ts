export interface SnapshotResponseMessage {
  feed: "book_ui_1_snapshot";
  product_id: string;
  numLevels: number;
  bids: number[][];
  asks: number[][];
}

export interface DeltaResponseMessage {
  feed: "book_ui_1";
  product_id: string;
  bids: number[][];
  asks: number[][];
}

export interface SubscriptionMessage {
  event: string;
  feed: string;
  product_ids: string[];
}
