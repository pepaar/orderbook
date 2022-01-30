import React from "react";
import styles from "./Spread.module.css";

interface Props {
  topBid: number | undefined;
  topAsk: number | undefined;
}

export const Spread: React.FC<Props> = ({ topBid, topAsk }) => {
  let spread = null;
  let spreadPercentage = "";

  if (topBid && topAsk) {
    spread = topAsk - topBid;
    spreadPercentage = ((spread / topAsk) * 100).toFixed(2);
  }

  if (spread === null) {
    return null;
  }

  return (
    <span className={styles.spread}>
      Spread: {spread.toLocaleString("en-us")} ({spreadPercentage}%)
    </span>
  );
};
