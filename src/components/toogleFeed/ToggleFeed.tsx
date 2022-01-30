import React from "react";
import { Currency } from "../../api/api";
import styles from "./ToggleFeed.module.css";

interface Props {
  currency: Currency;
  setCurrency: (newCurrency: Currency) => void;
}

export const ToggleFeed: React.FC<Props> = ({ currency, setCurrency }) => {
  const toggleCurrency = React.useCallback(() => {
    const newCurrency: Currency = currency === "Bitcoin" ? "Ethereum" : "Bitcoin";
    setCurrency(newCurrency);
  }, [currency, setCurrency]);

  return (
    <button onClick={toggleCurrency} className={styles.button}>
      ToggleFeed
    </button>
  );
};
