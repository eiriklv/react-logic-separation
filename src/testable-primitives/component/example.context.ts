import React from "react";

const useExample = () => {};

export interface ExampleContextInterface {
  useExample: typeof useExample;
}

export const defaultValue: ExampleContextInterface = {
  useExample,
};

export const ExampleContext =
  React.createContext<ExampleContextInterface>(defaultValue);
