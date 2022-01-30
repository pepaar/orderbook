import React from "react";
import { Currency } from "../../../api/api";
import styles from "./OrderBookHeader.module.css";

interface Props {
  currency: Currency;
  spread?: React.ReactNode;
}

export const OrderBookHeader: React.FC<Props> = ({ spread, currency }) => {
  const currencyText = currency === "Bitcoin" ? "BTC/USD" : "ETH/USD";

  return (
    <div className={styles.container}>
      <span>Order book ({currencyText})</span>
      {Boolean(spread) && <div className={styles.spread}>{spread}</div>}
    </div>
  );
};
