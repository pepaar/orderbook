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

export const OrderLine: React.FC<Props> = (props) => {
  const levelDepth = (props.order.total / props.highestTotal) * 100;
  const bgColor = priceColorToBackgroundColor(props.priceColor);
  const lineBackgroundStyle = `linear-gradient(to ${
    props.isLeftAligned ? "right" : "left"
  }, ${bgColor} ${levelDepth}%, transparent ${levelDepth}%)`;

  let rowStyle = styles.row;
  if (!props.isLeftAligned) {
    rowStyle += ` ${styles.rowReverse}`;
  }

  return (
    <div className={rowStyle} style={{ background: lineBackgroundStyle }}>
      <span className={priceTextStyles(props.priceColor)}>{formatNumericValue(props.order.price)}</span>
      <span className={styles.normalText}>{formatNumericValue(props.order.size)}</span>
      <span className={styles.normalText}>{formatNumericValue(props.order.total)}</span>
    </div>
  );
};

export const OrderLineTitle: React.FC<{ isLeftAligned: boolean }> = ({ isLeftAligned }) => {
  let rowStyle = styles.row;
  if (!isLeftAligned) {
    rowStyle += ` ${styles.rowReverse}`;
  }

  return (
    <div className={rowStyle}>
      <span className={styles.titleText}>PRICE</span>
      <span className={styles.titleText}>SIZE</span>
      <span className={styles.titleText}>TOTAL</span>
    </div>
  );
};

const priceTextStyles = (price: PriceColor) => (price === "green" ? styles.greenText : styles.redText);
const priceColorToBackgroundColor = (price: PriceColor) => (price === "green" ? "#4ba54b40" : "#b911116e");
const formatNumericValue = (value: number) => value.toLocaleString("en-us");
