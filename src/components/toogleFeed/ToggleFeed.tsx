import React from "react";
import { useRecoilState } from "recoil";
import { Currency, selectedCurrencyState } from "../../state/orderBookState";
import { Button } from "../common/button/Button";
import styles from "./ToggleFeed.module.css";

export const ToggleFeed: React.FC = () => {
  const [currency, setCurrency] = useRecoilState(selectedCurrencyState);

  const toggleCurrency = React.useCallback(() => {
    const newCurrency: Currency = currency === "Bitcoin" ? "Ethereum" : "Bitcoin";
    setCurrency(newCurrency);
  }, [currency, setCurrency]);

  return (
    <footer className={styles.footer}>
      <Button onClick={toggleCurrency} text="Toggle Feed" />
    </footer>
  );
};
