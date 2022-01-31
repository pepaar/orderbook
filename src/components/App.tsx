import React from "react";
import { useOrderBookDataSubscription } from "../data/orderBookData";
import styles from "./App.module.css";
import { OfflineHeader } from "./offlineHeader/OfflineHeader";
import { OrderBook } from "./orderBook/OrderBook";
import { ToggleFeed } from "./toogleFeed/ToggleFeed";

const App: React.FC = () => {
  const { reconnect } = useOrderBookDataSubscription();

  return (
    <div className={styles.container}>
      <header>
        <OfflineHeader reconnect={reconnect} />
      </header>
      <main>
        <OrderBook />
      </main>
      <footer className={styles.footer}>
        <ToggleFeed />
      </footer>
    </div>
  );
};

export default App;
