import React from "react";
import { useOrderBookData } from "../data/useOrderBookData";
import styles from "./App.module.css";
import { OrderBook } from "./orderBook/OrderBook";
import { ToggleFeed } from "./toogleFeed/ToggleFeed";

const App: React.FC = () => {
  const { data } = useOrderBookData("Bitcoin");

  return (
    <div className={styles.container}>
      <main>{data && <OrderBook orderBook={data} />}</main>
      <footer>
        <ToggleFeed />
      </footer>
    </div>
  );
};

export default App;
