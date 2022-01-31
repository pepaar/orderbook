import React from "react";
import * as api from "./api/orderBookApi";
import { connectionState, OrderBook, orderBookState, selectedCurrencyState } from "../state/orderBookState";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { throttle } from "lodash";

const throttleWaitLimitMs = 1000;

export const useOrderBookDataSubscription = () => {
  const currency = useRecoilValue(selectedCurrencyState);
  const [connection, setConnection] = useRecoilState(connectionState);
  const setOrderBook = useSetRecoilState(orderBookState);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    const onNewData = throttle((dataResponse: OrderBook) => {
      setOrderBook(dataResponse);
    }, throttleWaitLimitMs);

    api
      .initialize({
        setNewOrderBook: (book) => onNewData(book),
        getCurrentCurrency: () => currency,
      })
      .then(() => {
        api.subscribe(currency);
        setConnection({ isOnline: true });
      })
      .catch(() => {
        setError("Something went wrong!");
      });

    return () => {
      api.unsubscribe(currency);
      onNewData.flush();
      setError(undefined);
    };
  }, [currency, setConnection, setOrderBook]);

  React.useEffect(() => {
    window.onblur = () => {
      api.unsubscribe(currency);
      api.disconnect();
      setConnection({ isOnline: false });
    };
  }, [currency, setConnection]);

  const reconnect = React.useCallback(() => {
    if (!connection.isOnline) {
      api.subscribe(currency);
      setConnection({ isOnline: true });
    }
  }, [currency, connection.isOnline, setConnection]);

  return {
    isOnline: connection.isOnline,
    error,
    reconnect,
  };
};
