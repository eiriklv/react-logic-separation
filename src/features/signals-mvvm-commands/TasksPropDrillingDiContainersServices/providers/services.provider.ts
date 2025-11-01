import React, { useContext } from "react";
import { ITasksService } from "../services/tasks.service";
import { IUsersService } from "../services/users.service";

/**
 * The purpose of this context is to be able to
 * share the services throughout the application,
 * and that any layer can be the provider of
 * those services.
 *
 * The consumers of the services should not need
 * to care about where the services were provided,
 * just that they are available
 */

export interface ServicesContextInterface {
  tasksService: ITasksService;
  usersService: IUsersService;
}

export const ServicesContext = React.createContext<
  ServicesContextInterface | undefined
>(undefined);

export const useServices = () => {
  const services = useContext(ServicesContext);

  if (!services) {
    throw new Error("Services must be provided");
  }

  return services;
};
