import { createTasksModel } from "../../models/tasks.model";
import { createUsersModel } from "../../models/users.model";
import { createSelectedFiltersModel } from "../../models/selected-filters.model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type AppViewModelDependencies = {
  createTasksModel: typeof createTasksModel;
  createUsersModel: typeof createUsersModel;
  createSelectedFiltersModel: typeof createSelectedFiltersModel;
};

const defaultDependencies: AppViewModelDependencies = {
  createTasksModel,
  createUsersModel,
  createSelectedFiltersModel,
};

export default defaultDependencies;
