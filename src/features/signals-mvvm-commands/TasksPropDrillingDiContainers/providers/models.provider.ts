import React, { useContext } from "react";
import { IUsersModel } from "../models/users.model";
import { ITasksModel } from "../models/tasks.model";
import { PartialDeep } from "type-fest";

/**
 * The context can be used to inject any kind of
 * dependency, but mainly hooks and components/containers.
 *
 * The main purpose is to facilitate testing
 * and storybooking without having to make complex mocks
 * - and to keep the components as simple as possible.
 *
 * Can be used for integrating 3rd party libraries and
 * components into your application
 *
 * The other purpose is to completely avoid prop drilling,
 * which reduces the amount of indirection in components.
 *
 * The interfaces of the components also become much simpler.
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
