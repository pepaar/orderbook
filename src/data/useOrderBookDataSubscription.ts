import React from "react";
import * as api from "./api/orderBook/orderBookApi";
import { connectionState, OrderBook, orderBookState, selectedCurrencyState } from "../state/orderBook";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { throttle } from "lodash";

const throttleWaitLimitMs = 1000;

export const useOrderBookDataSubscription = () => {
  const currency = useRecoilValue(selectedCurrencyState);
  const [connection, setConnection] = useRecoilState(connectionState);
  const setOrderBook = useSetRecoilState(orderBookState);

  React.useEffect(() => {
    const onNewData = throttle((dataResponse: OrderBook) => {
      setOrderBook(dataResponse);
    }, throttleWaitLimitMs);

    api
      .initialize({
        setNewOrderBook: (book) => onNewData(book),
        currentCurrency: currency,
      })
      .then(() => {
        api.subscribe(currency);
        setConnection({ isOnline: true, error: null });
      })
      .catch(() => {
        setConnection({ isOnline: false, error: "Something went wrong!" });
      });

    return () => {
      api.unsubscribe(currency);
      onNewData.flush();
    };
  }, [currency, setConnection, setOrderBook]);

  React.useEffect(() => {
    window.onblur = () => {
      api.unsubscribe(currency);
      api.disconnect();
      setConnection((current) => ({ isOnline: false, error: current.error }));
    };
  }, [currency, setConnection]);

  const reconnect = React.useCallback(() => {
    if (!connection.isOnline) {
      api
        .subscribe(currency)
        .then(() => setConnection({ isOnline: true, error: null }))
        .catch(() => setConnection({ isOnline: false, error: "Cannot reconnect!" }));
    }
  }, [currency, connection.isOnline, setConnection]);

  return {
    reconnect,
  };
};
