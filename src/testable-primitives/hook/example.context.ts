import React from "react";

const exampleService = async () => {};

export interface UseExampleContextInterface {
  exampleService: typeof exampleService;
}

export const defaultValue: UseExampleContextInterface = {
  exampleService,
};

export const UseExampleContext =
  React.createContext<UseExampleContextInterface>(defaultValue);
