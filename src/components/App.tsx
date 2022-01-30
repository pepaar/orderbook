import React from "react";
import { Currency } from "../api/api";
import { useOrderBookData } from "../data/useOrderBookData";
import styles from "./App.module.css";
import { OfflineHeader } from "./offlineHeader/OfflineHeader";
import { OrderBook } from "./orderBook/OrderBook";
import { ToggleFeed } from "./toogleFeed/ToggleFeed";

const App: React.FC = () => {
  const [currency, setCurrency] = React.useState<Currency>("Bitcoin");
  const { data, isOnline, reconnect } = useOrderBookData(currency);

  return (
    <div className={styles.container}>
      <header>
        <OfflineHeader isOnline={isOnline} reconnect={reconnect} />
      </header>
      <main>{data && <OrderBook orderBook={data} />}</main>
      <footer className={styles.footer}>
        <ToggleFeed currency={currency} setCurrency={setCurrency} />
      </footer>
    </div>
  );
};

export default App;
