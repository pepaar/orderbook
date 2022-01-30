import React from "react";
import { Button } from "../common/button/Button";
import styles from "./OfflineHeader.module.css";

interface Props {
  isOnline: boolean;
  reconnect: () => void;
}

export const OfflineHeader: React.FC<Props> = ({ isOnline, reconnect }) => {
  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.container}>
      <span className={styles.text}>You are offline and data is not up to date!</span>
      <Button onClick={reconnect} text="Reconnect" />
    </div>
  );
};
