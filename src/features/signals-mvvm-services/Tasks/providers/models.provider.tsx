import { ReactNode } from "react";
import { ModelsContext, ModelsContextInterface } from "./models.context";

type ModelsProviderProps = {
  models: ModelsContextInterface;
  children: ReactNode;
};

export function ModelsProvider({ models, children }: ModelsProviderProps) {
  return (
    <ModelsContext.Provider value={models}>{children}</ModelsContext.Provider>
  );
}
