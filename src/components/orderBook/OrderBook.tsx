import React from "react";
import { OrderBookHeader } from "./orderBookHeader/OrderBookHeader";
import { OrderBookSide } from "./orderBookSide/OrderBookSide";
import styles from "./OrderBook.module.css";
import { OrderBook as OrderBookType } from "../../data/types";

interface Props {
  orderBook: OrderBookType;
}

export const OrderBook: React.FC<Props> = ({ orderBook }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <OrderBookHeader topAsk={orderBook.asks[0]?.price} topBid={orderBook.bids[0]?.price} />
      </div>
      <div className={styles.bids}>
        <OrderBookSide isBidsSide={true} orders={orderBook.bids} highestTotal={orderBook.highestTotal} isLeftAligned={false} />
      </div>
      <div className={styles.divider}>
        <div className={styles.dividerLine}></div>
      </div>
      <div className={styles.asks}>
        <OrderBookSide isBidsSide={false} orders={orderBook.asks} highestTotal={orderBook.highestTotal} isLeftAligned={true} />
      </div>
    </div>
  );
};
