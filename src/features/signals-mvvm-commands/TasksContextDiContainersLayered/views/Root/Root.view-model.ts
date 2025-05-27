import { useContext, useMemo } from "react";
import { RootViewModelContext } from "./Root.view-model.context";
import { CommandsContextInterface } from "../../providers/commands.provider";

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

export const useRootViewModel = () => {
  // Get dependencies
  const {
    createQueryClient,
    createTasksService,
    createUsersService,
    createAddTaskCommand,
    createDeleteTaskCommand,
    createGetUserCommand,
    createListTasksCommand,
    createListUsersCommand,
  } = useContext(RootViewModelContext);

  /**
   * Create the query client
   */
  const queryClient = createQueryClient();

  /**
   * Create SDK instances
   */
  const tasksService = createTasksService();
  const usersService = createUsersService();

  /**
   * Create the commands
   */
  const addTaskCommand = useMemo(
    () => createAddTaskCommand({ tasksService }),
    [createAddTaskCommand, tasksService],
  );
  const deleteTaskCommand = useMemo(
    () => createDeleteTaskCommand({ tasksService }),
    [createDeleteTaskCommand, tasksService],
  );
  const getUserCommand = useMemo(
    () => createGetUserCommand({ usersService }),
    [createGetUserCommand, usersService],
  );
  const listTasksCommand = useMemo(
    () => createListTasksCommand({ tasksService }),
    [createListTasksCommand, tasksService],
  );
  const listUsersCommand = useMemo(
    () => createListUsersCommand({ usersService }),
    [createListUsersCommand, usersService],
  );

  /**
   * Package the commands in an object
   */
  const commands: CommandsContextInterface = useMemo(
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
    queryClient,
    commands,
  };
};
