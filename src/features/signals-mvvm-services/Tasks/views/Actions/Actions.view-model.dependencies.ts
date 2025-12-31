import { ITasksModel } from "../../models/tasks.model";
import { IUsersModel } from "../../models/users.model";
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
  tasksModel: Pick<ITasksModel, "addTask">;
  usersModel: Pick<IUsersModel, "users">;
};

export type ActionsViewModelDependencies = {
  useModels: () => ModelsDependencies;
};

const defaultDependencies: ActionsViewModelDependencies = {
  useModels,
};

export default defaultDependencies;
