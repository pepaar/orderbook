import React from "react";
import { useWindowSize } from "react-use";
import { OrderBookHeader } from "./orderBookHeader/OrderBookHeader";
import { OrderBookSide } from "./orderBookSide/OrderBookSide";
import styles from "./OrderBook.module.css";
import { OrderBook as OrderBookType } from "../../data/types";
import { Spread } from "./spread/Spread";

const oneColumnBreakpoint = 680;

interface Props {
  orderBook: OrderBookType;
}

export const OrderBook: React.FC<Props> = ({ orderBook }) => {
  const { width } = useWindowSize();
  const isOneColumnView = width <= oneColumnBreakpoint;

  const spread = <Spread topAsk={orderBook.asks[0]?.price} topBid={orderBook.bids[0]?.price} />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <OrderBookHeader currency={orderBook.currency} spread={isOneColumnView ? undefined : spread} />
      </div>
      <div className={styles.asks}>
        <OrderBookSide
          isBidsSide={false}
          orders={orderBook.asks}
          highestTotal={orderBook.highestTotal}
          isLeftAligned={true}
          reverseOrder={isOneColumnView}
        />
      </div>
      {isOneColumnView ? <div className={styles.spread}>{spread}</div> : <div className={styles.divider} />}
      <div className={styles.bids}>
        <OrderBookSide
          isBidsSide={true}
          orders={orderBook.bids}
          highestTotal={orderBook.highestTotal}
          isLeftAligned={isOneColumnView}
          hideTitle={isOneColumnView}
        />
      </div>
    </div>
  );
};
