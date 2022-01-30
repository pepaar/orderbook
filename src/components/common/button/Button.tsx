import React from "react";
import styles from "./Button.module.css";

interface Props {
  text: string;
  onClick: () => void;
}

export const Button: React.FC<Props> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {text}
    </button>
  );
};
