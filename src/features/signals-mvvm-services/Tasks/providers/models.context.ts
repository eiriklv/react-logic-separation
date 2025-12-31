import { createContext } from "react";
import { IUsersModel } from "../models/users.model";
import { ITasksModel } from "../models/tasks.model";
import { ISelectedFiltersModel } from "../models/selected-filters.model";

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

export interface ModelsContextInterface {
  tasksModel: ITasksModel;
  usersModel: IUsersModel;
  selectedFiltersModel: ISelectedFiltersModel;
}

export const ModelsContext = createContext<ModelsContextInterface | undefined>(
  undefined,
);
