import { useContext, useMemo } from "react";
import { AppViewModelContext } from "./App.view-model.context";
import { ModelsContextInterface } from "../../providers/models.provider";

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

/**
 * Note: The <App> owns some of the shared domain models,
 * so it has the responsibility of creating the instances
 * and exposing them to the rest of the tree below.
 *
 * To do this it consumes the shared commands that
 * have been initialized and provider from further
 * up in the tree (owned by <Root>)
 */
export const useAppViewModel = () => {
  // Get dependencies
  const {
    createTasksModel,
    createUsersModel,
    createSelectedFiltersModel,
    useQueryClient,
    useCommands,
  } = useContext(AppViewModelContext);

  // Get the query client from the context
  const queryClient = useQueryClient();

  // Get commands from the command provider context
  const commands = useCommands();

  const {
    addTaskCommand,
    deleteTaskCommand,
    listTasksCommand,
    listUsersCommand,
  } = commands;

  /**
   * Create the model instances
   */
  const usersModel = useMemo(
    () =>
      createUsersModel(queryClient, {
        listUsersCommand,
      }),
    [createUsersModel, listUsersCommand, queryClient],
  );

  const tasksModel = useMemo(
    () =>
      createTasksModel(queryClient, {
        addTaskCommand,
        deleteTaskCommand,
        listTasksCommand,
      }),
    [
      addTaskCommand,
      createTasksModel,
      deleteTaskCommand,
      listTasksCommand,
      queryClient,
    ],
  );

  const selectedFiltersModel = useMemo(
    () => createSelectedFiltersModel(),
    [createSelectedFiltersModel],
  );

  /**
   * Package the model instances in a memoized object
   */
  const models: ModelsContextInterface = useMemo(
    () => ({
      usersModel,
      tasksModel,
      selectedFiltersModel,
    }),
    [selectedFiltersModel, tasksModel, usersModel],
  );

  return {
    models,
  };
};
