import React from "react";
import { Order } from "../../../state/orderBookState";
import { OrderLineTitle, OrderLine } from "../orderLine/OrderLine";
import styles from "./OrderBookSide.module.css";

interface Props {
  orders: Order[];
  highestTotal: number;
  isLeftAligned: boolean;
  isBidsSide: boolean;
  hideTitle?: boolean;
  reverseOrder?: boolean;
}

export const OrderBookSide: React.FC<Props> = (props) => {
  let orders = props.orders;

  if (props.reverseOrder) {
    orders = [...orders].reverse();
  }

  return (
    <div className={styles.container}>
      {!props.hideTitle && <OrderLineTitle isLeftAligned={props.isLeftAligned} />}
      {orders.map((order) => (
        <OrderLine
          key={order.price}
          order={order}
          highestTotal={props.highestTotal}
          isLeftAligned={props.isLeftAligned}
          priceColor={props.isBidsSide ? "green" : "red"}
        />
      ))}
    </div>
  );
};
