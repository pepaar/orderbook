import React from "react";
import { useOrderBookDataSubscription } from "../data/useOrderBookDataSubscription";
import styles from "./App.module.css";
import { ErrorBoundary } from "./common/errorBoundary/ErrorBoundary";
import { OfflineHeader } from "./offlineHeader/OfflineHeader";
import { OrderBook } from "./orderBook/OrderBook";
import { ToggleFeed } from "./toogleFeed/ToggleFeed";

const App: React.FC = () => {
  const { reconnect } = useOrderBookDataSubscription();

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <OfflineHeader reconnect={reconnect} />
        <OrderBook />
        <ToggleFeed />
      </div>
    </ErrorBoundary>
  );
};

export default App;
