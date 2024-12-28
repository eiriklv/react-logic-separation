import { Signal } from "@preact/signals-core";
import React, { useContext, useEffect, useState } from "react";

import { store, TodosModel } from "./model";

export const useSignal = <T>(signal: Signal<T>) => {
  const [value, setValue] = useState(signal.value);

  useEffect(() => {
    return signal.subscribe(() => {
      setValue(signal.value);
    });
  }, [signal]);

  return value;
};

export interface StoreContextInterface {
  store: TodosModel;
}

export const defaultValue: StoreContextInterface = {
  store,
};

export const StoreContext =
  React.createContext<StoreContextInterface>(defaultValue);

export const useStore = () => {
  const { store } = useContext(StoreContext);
  return store;
};
