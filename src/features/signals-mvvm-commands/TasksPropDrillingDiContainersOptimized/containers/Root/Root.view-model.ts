import { useMemo } from "react";
import defaultDependencies, {
  RootViewModelDependencies,
} from "./Root.view-model.dependencies";

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
  dependencies = defaultDependencies,
}: Props = {}) => {
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
    queryClient,
    commands,
  };
};
