import { createTasksModel } from "../../models/tasks.model";
import { createUsersModel } from "../../models/users.model";
import { createSelectedFiltersModel } from "../../models/selected-filters.model";
import { useQueryClient } from "@tanstack/react-query";
import { IListUsersCommand } from "../../commands/list-users.command";
import { useCommands } from "../../providers/commands.provider";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";
import { useServices } from "../../providers/services.provider";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

/**
 * Specify which subset of commands
 * we depend on in this module
 */
export type CommandsDependencies = {
  listUsersCommand: IListUsersCommand;
};

/**
 * Specify which subset of services
 * we depend on in this module
 */
export type ServicesDependencies = {
  tasksService: ITasksService;
  usersService: IUsersService;
};

export type AppViewModelDependencies = {
  createTasksModel: typeof createTasksModel;
  createUsersModel: typeof createUsersModel;
  createSelectedFiltersModel: typeof createSelectedFiltersModel;
  useQueryClient: typeof useQueryClient;
  useCommands: () => CommandsDependencies;
  useServices: () => ServicesDependencies;
};

const defaultDependencies: AppViewModelDependencies = {
  createTasksModel,
  createUsersModel,
  createSelectedFiltersModel,
  useQueryClient,
  useCommands,
  useServices,
};

export default defaultDependencies;
