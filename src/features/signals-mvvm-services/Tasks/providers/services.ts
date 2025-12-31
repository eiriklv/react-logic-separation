import { useContext } from "react";
import { ServicesContext } from "./services.context";

/**
 * The purpose of this context is to be able to
 * share models throughout the application,
 * and that any layer can be the provider of
 * those models.
 *
 * The consumers of the models should not need
 * to care about where the models were provided,
 * just that they are available
 */
export const useServices = () => {
  const services = useContext(ServicesContext);

  if (!services) {
    throw new Error("Services must be provided");
  }

  return services;
};
