import { createQueryClient } from "../../utils/create-query-client";
import { createTasksService } from "../../services/tasks.service";
import { createUsersService } from "../../services/users.service";
import { useTasksModel } from "../../models/tasks.model";
import { useUsersModel } from "../../models/users.model";
import { useSelectedFiltersModel } from "../../models/selected-filters.model";
import { createSdk } from "../../sdks/sdk";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type RootViewModelDependencies = {
  baseUrl: string;
  createSdk: typeof createSdk;
  createQueryClient: typeof createQueryClient;
  createTasksService: typeof createTasksService;
  createUsersService: typeof createUsersService;
  useTasksModel: typeof useTasksModel;
  useUsersModel: typeof useUsersModel;
  useSelectedFiltersModel: typeof useSelectedFiltersModel;
};

const defaultDependencies: RootViewModelDependencies = {
  baseUrl: "https://real-api.test",
  createSdk,
  createQueryClient,
  useTasksModel,
  useUsersModel,
  useSelectedFiltersModel,
  createTasksService,
  createUsersService,
};

export default defaultDependencies;
