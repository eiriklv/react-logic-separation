import { useMemo } from "react";
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
 * This is where the shared/global models
 * will be initialized and provided
 * to the rest of the tree for consumption
 */
export const useAppViewModel = ({
  dependencies = defaultDependencies,
}: Props = {}) => {
  // Get dependencies
  const {
    useServices,
    useQueryClient,
    createTasksModel,
    createUsersModel,
    createSelectedFiltersModel,
  } = dependencies;

  // Get the query client from the context
  const queryClient = useQueryClient();

  // Get services from the services provider context
  const services = useServices();

  const { tasksService, usersService } = services;

  /**
   * Create the models
   */
  const usersModel = useMemo(
    () =>
      createUsersModel(queryClient, {
        usersService,
      }),
    [createUsersModel, queryClient, usersService],
  );

  const tasksModel = useMemo(
    () =>
      createTasksModel(queryClient, {
        tasksService,
      }),
    [createTasksModel, queryClient, tasksService],
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
