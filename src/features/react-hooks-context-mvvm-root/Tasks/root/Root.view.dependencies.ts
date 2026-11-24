import { App } from "../views/App/App.view";
import { useSelectedFiltersModel } from "../models/selected-filters.model";
import { useTasksModel } from "../models/tasks.model";
import { useUsersModel } from "../models/users.model";
import { createSdk } from "../sdks/sdk";
import { createTasksService } from "../services/tasks.service";
import { createUsersService } from "../services/users.service";
import { createQueryClient } from "../utils/create-query-client";
import { BrowserRouter } from "react-router";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type RootDependencies = {
  App: typeof App;
  Router: typeof BrowserRouter
  baseUrl: string;
  createSdk: typeof createSdk;
  createQueryClient: typeof createQueryClient;
  createTasksService: typeof createTasksService;
  createUsersService: typeof createUsersService;
  useTasksModel: typeof useTasksModel;
  useUsersModel: typeof useUsersModel;
  useSelectedFiltersModel: typeof useSelectedFiltersModel;
};

const defaultDependencies: RootDependencies = {
  App,
  Router: BrowserRouter,
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
