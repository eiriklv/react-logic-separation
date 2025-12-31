import { useQueryClient } from "@tanstack/react-query";
import { ITasksModel } from "../../models/tasks.model";
import { createUserModel, IUserModel } from "../../models/user.model";
import { IUsersService } from "../../services/users.service";
import { useServices } from "../../providers/services";
import { useModels } from "../../providers/models";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

/**
 * Specify which subset of models
 * we depend on in this module
 */
export type ModelsDependencies = {
  tasksModel: Pick<ITasksModel, "deleteTask">;
};

/**
 * Specify which subset of services
 * we depend on in this module
 */
export type ServicesDependencies = {
  usersService: Pick<IUsersService, "getUserById">;
};

export type TaskItemViewModelDependencies = {
  createUserModel: (
    ...args: Parameters<typeof createUserModel>
  ) => Pick<IUserModel, "user">;
  useModels: () => ModelsDependencies;
  useServices: () => ServicesDependencies;
  useQueryClient: typeof useQueryClient;
};

const defaultDependencies: TaskItemViewModelDependencies = {
  createUserModel,
  useModels,
  useServices,
  useQueryClient,
};

export default defaultDependencies;
