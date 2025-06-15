import React, { useContext } from "react";
import { IAddTaskCommand } from "../commands/add-task.command";
import { IDeleteTaskCommand } from "../commands/delete-task.command";
import { IGetUserCommand } from "../commands/get-user.command";
import { IListTasksCommand } from "../commands/list-tasks.command";
import { IListUsersCommand } from "../commands/list-users.command";

/**
 * The purpose of this context is to be able to
 * share the commands throughout the application,
 * and that any layer can be the provider of
 * those commands.
 *
 * The consumers of the commands should not need
 * to care about where the commands were provided,
 * just that they are available
 */

export interface CommandsContextInterface {
  addTaskCommand: IAddTaskCommand;
  deleteTaskCommand: IDeleteTaskCommand;
  getUserCommand: IGetUserCommand;
  listTasksCommand: IListTasksCommand;
  listUsersCommand: IListUsersCommand;
}

export const CommandsContext = React.createContext<
  CommandsContextInterface | undefined
>(undefined);

export const useCommands = () => {
  const commands = useContext(CommandsContext);

  if (!commands) {
    throw new Error("Commands must be provided");
  }

  return commands;
};
