import { snapshot_UNSTABLE } from "recoil";
import { maxLevelsCountState, OrderBook, orderBookState, topOfOrderBookState } from "./orderBook";

test("topOfOrderBookState", () => {
  const testOrderBook: OrderBook = {
    currency: "Bitcoin",
    asks: [
      { price: 1000, size: 100, total: 100 },
      { price: 1010, size: 50, total: 150 },
      { price: 1020, size: 50, total: 200 },
    ],
    bids: [
      { price: 950, size: 200, total: 200 },
      { price: 930, size: 60, total: 260 },
    ],
    highestTotal: 0,
  };

  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(orderBookState, testOrderBook);
    set(maxLevelsCountState, 2);
  });

  const topOfBook = snapshot.getLoadable(topOfOrderBookState).valueOrThrow();

  expect(topOfBook).toBeDefined();
  expect(topOfBook?.asks.length).toBe(2);
  expect(topOfBook?.bids.length).toBe(2);
  expect(topOfBook?.highestTotal).toBe(260);
});

test("topOfOrderBookState - no order book", () => {
  const snapshot = snapshot_UNSTABLE();
  expect(snapshot.getLoadable(topOfOrderBookState).valueOrThrow()).toBe(null);
});

test("topOfOrderBookState - empty bids and asks", () => {
  const testOrderBook: OrderBook = {
    currency: "Bitcoin",
    asks: [],
    bids: [],
    highestTotal: 0,
  };

  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(orderBookState, testOrderBook);
  });

  const topOfBook = snapshot.getLoadable(topOfOrderBookState).valueOrThrow();

  expect(topOfBook).toBeDefined();
  expect(topOfBook?.asks.length).toBe(0);
  expect(topOfBook?.bids.length).toBe(0);
  expect(topOfBook?.highestTotal).toBe(0);
});
