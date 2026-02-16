import { createContext, useContext } from "react";
import { ITasksModel } from "../models/tasks.model";
import { IUsersModel } from "../models/users.model";
import { ISelectedFiltersModel } from "../models/selected-filters.model";

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

export interface ModelsContextInterface {
  tasksModel: ITasksModel;
  usersModel: IUsersModel;
  selectedFiltersModel: ISelectedFiltersModel;
}

const ModelsContext = createContext<ModelsContextInterface | undefined>(
  undefined,
);

export const ModelsProvider = ModelsContext.Provider;

export const useModels = () => {
  const models = useContext(ModelsContext);

  if (!models) {
    throw new Error("Models must be provided");
  }

  return models;
};
