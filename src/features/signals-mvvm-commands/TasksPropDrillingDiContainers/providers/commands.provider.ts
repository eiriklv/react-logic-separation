import React, { useContext } from "react";
import { IAddTaskCommandInvocation } from "../commands/add-task.command";
import { IDeleteTaskCommandInvocation } from "../commands/delete-task.command";
import { IGetUserCommandInvocation } from "../commands/get-user.command";
import { IListTasksCommandInvocation } from "../commands/list-tasks.command";
import { IListUsersCommandInvocation } from "../commands/list-users.command";
import { PartialDeep } from "type-fest";

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
