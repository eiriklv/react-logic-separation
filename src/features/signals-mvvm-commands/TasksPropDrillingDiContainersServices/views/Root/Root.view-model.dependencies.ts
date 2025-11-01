import { createListTasksCommand } from "../../commands/list-tasks.command";
import { createListUsersCommand } from "../../commands/list-users.command";
import { createQueryClient } from "../../utils/create-query-client";
import { createTasksService } from "../../services/tasks.service";
import { createUsersService } from "../../services/users.service";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type RootViewModelDependencies = {
  createQueryClient: typeof createQueryClient;
  createTasksService: typeof createTasksService;
  createUsersService: typeof createUsersService;
  createListTasksCommand: typeof createListTasksCommand;
  createListUsersCommand: typeof createListUsersCommand;
};

const defaultDependencies: RootViewModelDependencies = {
  createQueryClient,
  createTasksService,
  createUsersService,
  createListTasksCommand,
  createListUsersCommand,
};

export default defaultDependencies;
