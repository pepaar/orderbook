import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { RecoilRoot } from "recoil";
import { OrderBook, orderBookState } from "../state/orderBook";

const orderBook: OrderBook = {
  currency: "Bitcoin",
  asks: [
    { price: 1000, size: 100, total: 100 },
    { price: 1010, size: 50, total: 150 },
  ],
  bids: [
    { price: 950, size: 200, total: 200 },
    { price: 930, size: 60, total: 260 },
  ],
  highestTotal: 260,
};

test("renders app", () => {
  const { container } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(orderBookState, orderBook);
      }}
    >
      <App />
    </RecoilRoot>
  );
  const toggleButton = screen.getByText("Toggle Feed");
  expect(toggleButton).toBeInTheDocument();

  const orderBookTitle = screen.getByText("Order book (BTC/USD)");
  expect(orderBookTitle).toBeInTheDocument();

  const orderBookSpread = screen.getByText("Spread: 50 (5.00%)");
  expect(orderBookSpread).toBeInTheDocument();

  // Check that app renders all asks and bids rows
  const rows = container.querySelectorAll(".row");
  expect(rows.length).toBe(6);
});
