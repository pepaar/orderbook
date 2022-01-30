import React from "react";
import { throttle } from "lodash";
import * as api from "../api/api";
import { Currency } from "../api/api";
import { OrderBook } from "./types";

const throttleWaitLimitMs = 1000;

export const useOrderBookData = (currency: Currency) => {
  const [data, setData] = React.useState<OrderBook>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isOnline, setIsOnline] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    const onNewData = throttle((dataResponse: OrderBook) => {
      setData(dataResponse);
    }, throttleWaitLimitMs);

    api
      .initialize(onNewData)
      .then(() => {
        api.subscribe(currency);
        setIsLoading(false);
        setIsOnline(true);
      })
      .catch(() => {
        setError("Something went wrong!");
      });

    return () => api.unsubscribe(currency);
  }, [currency]);

  React.useEffect(() => {
    window.onblur = () => {
      api.unsubscribe(currency);
      api.disconnect();
      setIsOnline(false);
    };
  }, [currency]);

  const reconnect = React.useCallback(() => {
    if (!isOnline) {
      api.subscribe(currency);
      setIsOnline(true);
    }
  }, [currency, isOnline]);

  return {
    data,
    isLoading,
    error,
    isOnline,
    reconnect,
  };
};
