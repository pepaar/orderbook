import React from "react";
import { Order } from "../../../data/types";
import { OrderLineTitle, OrderLine } from "../orderLine/OrderLine";
import styles from "./OrderBookSide.module.css";

interface Props {
  orders: Order[];
  highestTotal: number;
  isLeftAligned: boolean;
  isBidsSide: boolean;
}

export const OrderBookSide: React.FC<Props> = ({ orders, highestTotal, isLeftAligned, isBidsSide }) => {
  return (
    <div className={styles.container}>
      <OrderLineTitle isLeftAligned={isLeftAligned} />
      {orders.map((order) => (
        <OrderLine
          key={order.price}
          order={order}
          highestTotal={highestTotal}
          isLeftAligned={isLeftAligned}
          priceColor={isBidsSide ? "green" : "red"}
        />
      ))}
    </div>
  );
};
