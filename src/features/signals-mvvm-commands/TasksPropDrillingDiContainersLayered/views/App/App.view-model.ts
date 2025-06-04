import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CommandsContextInterface,
  useCommands,
} from "../../providers/commands.provider";
import defaultDependencies, {
  AppViewModelDependencies,
} from "./App.view-model.dependencies";
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

type Props = {
  dependencies?: AppViewModelDependencies;
};

/**
 * Specify which of the commands from the
 * command provider we want to subscribe
 * to (just the ones we use), to avoid
 * having to subscribe to all of them
 */
export type CommandsDependencies = Pick<
  CommandsContextInterface,
  | "addTaskCommand"
  | "deleteTaskCommand"
  | "listTasksCommand"
  | "listUsersCommand"
>;

/**
 * This is where the shared/global models
 * will be initialized and provided
 * to the rest of the tree for consumption
 */
export const useAppViewModel = ({
  dependencies = defaultDependencies,
}: Props = {}) => {
  // Get dependencies
  const { createTasksModel, createUsersModel, createSelectedFiltersModel } =
    dependencies;

  // Get the query client from the context
  const queryClient = useQueryClient();

  // Get commands from the command provider context
  const commands = useCommands<CommandsDependencies>();

  const {
    addTaskCommand,
    deleteTaskCommand,
    listTasksCommand,
    listUsersCommand,
  } = commands;

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
   * Create the models
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
   * Package the models in an object
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
