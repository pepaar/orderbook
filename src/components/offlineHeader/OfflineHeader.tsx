import React from "react";
import { useRecoilValue } from "recoil";
import { connectionState } from "../../state/orderBookState";
import { Button } from "../common/button/Button";
import styles from "./OfflineHeader.module.css";

interface Props {
  reconnect: () => void;
}

export const OfflineHeader: React.FC<Props> = ({ reconnect }) => {
  const connection = useRecoilValue(connectionState);
  if (connection.isOnline) {
    return null;
  }

  const text = connection.error ?? "You are offline and data is not up to date!";

  return (
    <div className={styles.container}>
      <span className={styles.text}>{text}</span>
      <Button onClick={reconnect} text="Reconnect" />
    </div>
  );
};
