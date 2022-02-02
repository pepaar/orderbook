import React from "react";
import { useWindowSize } from "react-use";
import { OrderBookHeader } from "./orderBookHeader/OrderBookHeader";
import { OrderBookSide } from "./orderBookSide/OrderBookSide";
import styles from "./OrderBook.module.css";
import { Spread } from "./spread/Spread";
import { useRecoilValue } from "recoil";
import { topOfOrderBookState } from "../../state/orderBook";

const oneColumnBreakpoint = 680;

export const OrderBook: React.FC = () => {
  const orderBook = useRecoilValue(topOfOrderBookState);
  const { width } = useWindowSize();

  if (!orderBook) {
    return null;
  }

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
