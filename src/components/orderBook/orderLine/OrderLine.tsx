import React from "react";
import { Order } from "../../../data/types";
import styles from "./OrderLine.module.css";

type PriceColor = "green" | "red";

interface Props {
  order: Order;
  highestTotal: number;
  isLeftAligned: boolean;
  priceColor: PriceColor;
}

export const OrderLine: React.FC<Props> = ({ order, isLeftAligned, priceColor }) => {
  return (
    <>
      <div className={priceTextStyles(priceColor)}>{formatNumericValue(order.price)}</div>
      <div className={styles.normalText}>{formatNumericValue(order.size)}</div>
      <div className={styles.normalText}>{formatNumericValue(order.total)}</div>
    </>
  );
};

export const OrderLineTitle: React.FC<{ isLeftAligned: boolean }> = ({ isLeftAligned }) => {
  return (
    <>
      <div className={styles.titleText}>PRICE</div>
      <div className={styles.titleText}>SIZE</div>
      <div className={styles.titleText}>TOTAL</div>
    </>
  );
};

const priceTextStyles = (price: PriceColor) => (price === "green" ? styles.greenText : styles.redText);
const formatNumericValue = (value: number) => value.toLocaleString("en-us");
