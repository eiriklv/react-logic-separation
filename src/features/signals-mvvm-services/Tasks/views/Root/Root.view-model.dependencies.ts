import { createQueryClient } from "../../utils/create-query-client";
import { createTasksService } from "../../services/tasks.service";
import { createUsersService } from "../../services/users.service";
import { createTasksModel } from "../../models/tasks.model";
import { createUsersModel } from "../../models/users.model";
import { createSelectedFiltersModel } from "../../models/selected-filters.model";
import { createSdk } from "../../sdks/sdk";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type RootViewModelDependencies = {
  createSdk: typeof createSdk;
  createQueryClient: typeof createQueryClient;
  createTasksService: typeof createTasksService;
  createUsersService: typeof createUsersService;
  createTasksModel: typeof createTasksModel;
  createUsersModel: typeof createUsersModel;
  createSelectedFiltersModel: typeof createSelectedFiltersModel;
};

const defaultDependencies: RootViewModelDependencies = {
  createSdk,
  createQueryClient,
  createTasksService,
  createUsersService,
  createTasksModel,
  createUsersModel,
  createSelectedFiltersModel,
};

export default defaultDependencies;
