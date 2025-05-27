import { createQueryClient } from "../../utils/create-query-client";
import { createAddTaskCommand } from "../../commands/add-task.command";
import { createDeleteTaskCommand } from "../../commands/delete-task.command";
import { createGetUserCommand } from "../../commands/get-user.command";
import { createListTasksCommand } from "../../commands/list-tasks.command";
import { createListUsersCommand } from "../../commands/list-users.command";
import { createTasksService } from "../../services/tasks.service";
import { createUsersService } from "../../services/users.service";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export interface RootViewModelDependencies {
  createQueryClient: typeof createQueryClient;
  createTasksService: typeof createTasksService;
  createUsersService: typeof createUsersService;
  createAddTaskCommand: typeof createAddTaskCommand;
  createDeleteTaskCommand: typeof createDeleteTaskCommand;
  createGetUserCommand: typeof createGetUserCommand;
  createListTasksCommand: typeof createListTasksCommand;
  createListUsersCommand: typeof createListUsersCommand;
}

const defaultDependencies: RootViewModelDependencies = {
  createQueryClient,
  createTasksService,
  createUsersService,
  createAddTaskCommand,
  createDeleteTaskCommand,
  createGetUserCommand,
  createListTasksCommand,
  createListUsersCommand,
};

export default defaultDependencies;
