import React from "react";
import { Currency } from "../../../api/api";
import styles from "./OrderBookHeader.module.css";

interface Props {
  topBid: number | undefined;
  topAsk: number | undefined;
  currency: Currency;
}

export const OrderBookHeader: React.FC<Props> = ({ topBid, topAsk, currency }) => {
  let spread = null;
  let spreadPercentage = "";

  if (topBid && topAsk) {
    spread = topAsk - topBid;
    spreadPercentage = ((spread / topAsk) * 100).toFixed(2);
  }

  const currencyText = currency === "Bitcoin" ? "BTC/USD" : "ETH/USD";

  return (
    <div className={styles.container}>
      <span className={styles.title}>Order book ({currencyText})</span>
      {spread !== null && (
        <span className={styles.spread}>
          Spread: {spread.toLocaleString("en-us")} ({spreadPercentage}%)
        </span>
      )}
    </div>
  );
};
