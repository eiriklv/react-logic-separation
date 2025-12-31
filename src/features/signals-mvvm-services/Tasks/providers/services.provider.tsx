import { ReactNode } from "react";
import { ServicesContext, ServicesContextInterface } from "./services.context";

type ServicesProviderProps = {
  services: ServicesContextInterface;
  children: ReactNode;
};

export function ServicesProvider({
  services,
  children,
}: ServicesProviderProps) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}
