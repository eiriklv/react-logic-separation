import React from "react";
import { createQueryClient } from "../../utils/create-query-client";
import { createAddTaskCommand } from "../../commands/add-task.command";
import { createDeleteTaskCommand } from "../../commands/delete-task.command";
import { createGetUserCommand } from "../../commands/get-user.command";
import { createListTasksCommand } from "../../commands/list-tasks.command";
import { createListUsersCommand } from "../../commands/list-users.command";

/**
 * The context can be used to inject any kind of
 * dependency, but mainly hooks and components/containers.
 *
 * The main purpose is to facilitate testing
 * and storybooking without having to make complex mocks
 * - and to keep the components as simple as possible.
 *
 * Can be used for integrating 3rd party libraries and
 * components into your application
 *
 * The other purpose is to completely avoid prop drilling,
 * which reduces the amount of indirection in components.
 *
 * The interfaces of the components also become much simpler.
 */

export interface RootViewModelContextInterface {
  createQueryClient: typeof createQueryClient;
  createAddTaskCommand: typeof createAddTaskCommand;
  createDeleteTaskCommand: typeof createDeleteTaskCommand;
  createGetUserCommand: typeof createGetUserCommand;
  createListTasksCommand: typeof createListTasksCommand;
  createListUsersCommand: typeof createListUsersCommand;
}

export const defaultValue: RootViewModelContextInterface = {
  createQueryClient,
  createAddTaskCommand,
  createDeleteTaskCommand,
  createGetUserCommand,
  createListTasksCommand,
  createListUsersCommand,
};

export const RootViewModelContext =
  React.createContext<RootViewModelContextInterface>(defaultValue);
