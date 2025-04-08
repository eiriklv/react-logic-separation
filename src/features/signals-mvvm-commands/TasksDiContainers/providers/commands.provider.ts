import React, { useContext } from "react";
import { IAddTaskCommandInvocation } from "../commands/add-task.command";
import { IDeleteTaskCommandInvocation } from "../commands/delete-task.command";
import { IGetUserCommandInvocation } from "../commands/get-user.command";
import { IListTasksCommandInvocation } from "../commands/list-tasks.command";
import { IListUsersCommandInvocation } from "../commands/list-users.command";
import { PartialDeep } from "type-fest";

/**
 * The purpose of this context is to be able to
 * share the commands throughout the application,
 * and that any layer can be the provider of
 * those commands.
 *
 * The consumers of the commands should not need
 * to care about where the commands where provided,
 * just that they are available
 */

export interface CommandsContextInterface {
  addTaskCommand: IAddTaskCommandInvocation;
  deleteTaskCommand: IDeleteTaskCommandInvocation;
  getUserCommand: IGetUserCommandInvocation;
  listTasksCommand: IListTasksCommandInvocation;
  listUsersCommand: IListUsersCommandInvocation;
}

export type CommandsContextType = PartialDeep<CommandsContextInterface>;

export const CommandsContext = React.createContext<
  CommandsContextType | undefined
>(undefined);

export const useCommands = <T extends CommandsContextType>() => {
  const commands = useContext(CommandsContext);

  if (!commands) {
    throw new Error("Commands must be provided");
  }

  return commands as T;
};
