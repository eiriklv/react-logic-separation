import { createTasksModel } from "../../models/tasks.model";
import { createUsersModel } from "../../models/users.model";
import { createSelectedFiltersModel } from "../../models/selected-filters.model";
import { useQueryClient } from "@tanstack/react-query";
import { IAddTaskCommand } from "../../commands/add-task.command";
import { IDeleteTaskCommand } from "../../commands/delete-task.command";
import { IListTasksCommand } from "../../commands/list-tasks.command";
import { IListUsersCommand } from "../../commands/list-users.command";
import { useCommands } from "../../providers/commands.provider";

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
  addTaskCommand: IAddTaskCommand;
  deleteTaskCommand: IDeleteTaskCommand;
  listTasksCommand: IListTasksCommand;
  listUsersCommand: IListUsersCommand;
};

export type AppViewModelDependencies = {
  createTasksModel: typeof createTasksModel;
  createUsersModel: typeof createUsersModel;
  createSelectedFiltersModel: typeof createSelectedFiltersModel;
  useQueryClient: typeof useQueryClient;
  useCommands: () => CommandsDependencies;
};

const defaultDependencies: AppViewModelDependencies = {
  createTasksModel,
  createUsersModel,
  createSelectedFiltersModel,
  useQueryClient,
  useCommands,
};

export default defaultDependencies;
