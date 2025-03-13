import { useContext } from "react";
import { UseExampleContext } from "./example.context";

export const useExample = () => {
  const { exampleService } = useContext(UseExampleContext);
  return exampleService;
};
