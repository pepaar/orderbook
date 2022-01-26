import React from "react";
import styles from "./OrderBookHeader.module.css";

interface Props {
  topBid: number | undefined;
  topAsk: number | undefined;
}

export const OrderBookHeader: React.FC<Props> = ({ topBid, topAsk }) => {
  let spread = null;
  let spreadPercentage = "";

  if (topBid && topAsk) {
    spread = topAsk - topBid;
    spreadPercentage = ((spread / topAsk) * 100).toFixed(2);
  }

  return (
    <div className={styles.container}>
      <span className={styles.title}>Order book</span>
      {spread !== null && (
        <span className={styles.spread}>
          Spread: {spread.toLocaleString("en-us")} ({spreadPercentage}%)
        </span>
      )}
    </div>
  );
};
