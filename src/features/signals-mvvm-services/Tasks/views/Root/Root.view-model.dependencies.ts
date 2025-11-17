import { createQueryClient } from "../../utils/create-query-client";
import { createTasksService } from "../../services/tasks.service";
import { createUsersService } from "../../services/users.service";
import { createTasksModel } from "../../models/tasks.model";
import { createUsersModel } from "../../models/users.model";
import { createSelectedFiltersModel } from "../../models/selected-filters.model";
import { createSdk } from "../../sdks/sdk";
import { createTasksServiceMock } from "../../services/tasks.service.mock";
import { createUsersServiceMock } from "../../services/users.service.mock";

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
  createTasksModel,
  createUsersModel,
  createSelectedFiltersModel,
  /**
   * NOTE(eiriklv): Using mock services
   * by default, since we have no backend yet
   */
  createTasksService: createTasksServiceMock,
  createUsersService: createUsersServiceMock,
};

export default defaultDependencies;
