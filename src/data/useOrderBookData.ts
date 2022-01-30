import React from "react";
import { throttle } from "lodash";
import * as api from "../api/api";
import { Currency } from "../api/api";
import { OrderBook } from "./types";

export const useOrderBookData = (currency: Currency) => {
  const [data, setData] = React.useState<OrderBook>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    const onNewData = throttle((dataResponse: OrderBook) => {
      setData(dataResponse);
    }, 1000);

    api
      .initialize(onNewData)
      .then(() => {
        api.subscribe(currency);
        setLoading(false);

        setTimeout(() => {
          api.unsubscribe(currency);
        }, 10000);
      })
      .catch(() => {
        setError("Something went wrong!");
      });

    return () => api.unsubscribe(currency);
  }, [currency]);

  React.useEffect(() => {}, [currency]);

  return {
    data,
    loading,
    error,
  };
};
