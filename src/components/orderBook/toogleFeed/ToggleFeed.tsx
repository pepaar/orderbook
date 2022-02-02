import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Currency, selectedCurrencyState, topOfOrderBookState } from "../../../state/orderBook";
import { Button } from "../../common/button/Button";
import styles from "./ToggleFeed.module.css";

export const ToggleFeed: React.FC = () => {
  const [currency, setCurrency] = useRecoilState(selectedCurrencyState);
  const orderBook = useRecoilValue(topOfOrderBookState);

  const toggleCurrency = React.useCallback(() => {
    const newCurrency: Currency = currency === "Bitcoin" ? "Ethereum" : "Bitcoin";
    setCurrency(newCurrency);
  }, [currency, setCurrency]);

  if (!orderBook) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <Button onClick={toggleCurrency} text="Toggle Feed" />
    </footer>
  );
};
