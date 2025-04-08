import { useMemo } from "react";
import { createAddTaskCommand } from "../../commands/add-task.command";
import { createDeleteTaskCommand } from "../../commands/delete-task.command";
import { createGetUserCommand } from "../../commands/get-user.command";
import { createListTasksCommand } from "../../commands/list-tasks.command";
import { createListUsersCommand } from "../../commands/list-users.command";
import { createQueryClient } from "../../utils/create-query-client";

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by providing custom hooks with appropriate
 * interfaces - taking care not to expose
 * implementation details of the business
 * logic itself or libraries used
 *
 * It can also be used for 3rd party library hooks,
 * so that you avoid coupling your component directly.
 * Instead you can provide a nice interface and map
 * the custom hooks into it
 */

export type RootViewModelDependencies = {
  createQueryClient: typeof createQueryClient;
  createAddTaskCommand: typeof createAddTaskCommand;
  createDeleteTaskCommand: typeof createDeleteTaskCommand;
  createGetUserCommand: typeof createGetUserCommand;
  createListTasksCommand: typeof createListTasksCommand;
  createListUsersCommand: typeof createListUsersCommand;
};

type Props = {
  dependencies?: RootViewModelDependencies;
};

/**
 * TODO: Here is where the global providers
 * need to be initialized (potentially in the view model of this)
 *
 * - Models
 * - Commands
 * - Flags
 * - Etc..
 */
export const useRootViewModel = ({
  dependencies = {
    createQueryClient,
    createAddTaskCommand,
    createDeleteTaskCommand,
    createGetUserCommand,
    createListTasksCommand,
    createListUsersCommand,
  },
}: Props = {}) => {
  // Get dependencies
  const {
    createQueryClient,
    createAddTaskCommand,
    createDeleteTaskCommand,
    createGetUserCommand,
    createListTasksCommand,
    createListUsersCommand,
  } = dependencies;

  // Get commands from the command provider context

  /**
   * TODO: Create all the commands first, and then let
   * them be injected into the models.
   *
   * It has to be possible to just replace the command
   * layer dependencies in the tree and then the models
   * would work against fake commands.
   *
   * Where should the injection of the commands happen?
   * One layer further up and then this view model
   * will depend on that context and then inject
   * them into the models?
   */

  /**
   * Create the query client
   */
  const queryClient = createQueryClient();

  /**
   * Create the commands
   */
  const addTaskCommand = useMemo(
    () => createAddTaskCommand(),
    [createAddTaskCommand],
  );
  const deleteTaskCommand = useMemo(
    () => createDeleteTaskCommand(),
    [createDeleteTaskCommand],
  );
  const getUserCommand = useMemo(
    () => createGetUserCommand(),
    [createGetUserCommand],
  );
  const listTasksCommand = useMemo(
    () => createListTasksCommand(),
    [createListTasksCommand],
  );
  const listUsersCommand = useMemo(
    () => createListUsersCommand(),
    [createListUsersCommand],
  );

  /**
   * Package the commands in an object
   */
  const commands = useMemo(
    () => ({
      addTaskCommand,
      deleteTaskCommand,
      getUserCommand,
      listTasksCommand,
      listUsersCommand,
    }),
    [
      addTaskCommand,
      deleteTaskCommand,
      getUserCommand,
      listTasksCommand,
      listUsersCommand,
    ],
  );

  return {
    commands,
    queryClient,
  };
};
