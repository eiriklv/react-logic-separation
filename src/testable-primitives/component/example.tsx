import { useContext } from "react";
import { ExampleContext } from "./example.context";

export const Example = () => {
  const { useExample } = useContext(ExampleContext);
  const example = useExample();
  return <>{example}</>;
};
