import { useContext } from "react";
import { ModelsContext } from "./models.context";

/**
 * The purpose of this hook is to be able to
 * consume models throughout the application.
 *
 * The consumers of the models should not need
 * to care about where the models were provided,
 * just that they are available.
 *
 * The consumer should not have to know that
 * a context exists - that's just an implementation detail
 */

export const useModels = () => {
  const models = useContext(ModelsContext);

  if (!models) {
    throw new Error("Models must be provided");
  }

  return models;
};
