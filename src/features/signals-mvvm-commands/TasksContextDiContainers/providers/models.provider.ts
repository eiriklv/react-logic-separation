import React, { useContext } from "react";
import { IUsersModel } from "../models/users.model";
import { ITasksModel } from "../models/tasks.model";
import { PartialDeep } from "type-fest";

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
}

export type ModelsContextType = PartialDeep<ModelsContextInterface>;

export const ModelsContext = React.createContext<ModelsContextType | undefined>(
  undefined,
);

export const useModels = <T extends ModelsContextType>() => {
  const models = useContext(ModelsContext);

  if (!models) {
    throw new Error("Models must be provided");
  }

  return models as T;
};
