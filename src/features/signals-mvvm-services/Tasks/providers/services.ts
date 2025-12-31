import { useContext } from "react";
import { ServicesContext } from "./services.context";

/**
 * The purpose of this hook is to be able to
 * consume services throughout the application.
 *
 * The consumers of the services should not need
 * to care about where the models were provided,
 * just that they are available
 *
 * The consumer should not have to know that
 * a context exists - that's just an implementation detail
 */

export const useServices = () => {
  const services = useContext(ServicesContext);

  if (!services) {
    throw new Error("Services must be provided");
  }

  return services;
};
