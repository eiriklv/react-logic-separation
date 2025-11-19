import { useMemo } from "react";
import defaultDependencies, {
  RootViewModelDependencies,
} from "./Root.view-model.dependencies";
import { ServicesContextInterface } from "../../providers/services.provider";
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
  dependencies?: RootViewModelDependencies;
};

/**
 * TODO: Here is where the global providers
 * need to be initialized (potentially in the view model of this)
 *
 * - Models
 * - Services
 * - Flags
 * - Etc..
 */
export const useRootViewModel = ({
  dependencies = defaultDependencies,
}: Props = {}) => {
  // Get dependencies
  const {
    baseUrl,
    createSdk,
    createQueryClient,
    createTasksService,
    createUsersService,
    createTasksModel,
    createUsersModel,
    createSelectedFiltersModel,
  } = dependencies;

  /**
   * NOTE: Create all the services first, and then let
   * them be injected into the models.
   *
   * It has to be possible to just replace the service
   * layer dependencies in the tree and then the models
   * would work against fake services.
   *
   * Where should the injection of the services happen?
   * One layer further up and then this view model
   * will depend on that context and then inject
   * them into the models?
   */

  /**
   * Create the query client
   */
  const queryClient = createQueryClient();

  /**
   * Create the SDK client
   *
   * TODO(eirikv): Inject the base url somehow
   * (via environment and dependency injection)
   */
  const sdk = createSdk(baseUrl);

  /**
   * Create service instances
   *
   * NOTE: The only way IO can be performed
   * is via services - no other way is allowed.
   *
   * Anything doing IO (network, storage, etc)
   * must be wrapped in a service and then exposed.
   */
  const tasksService = createTasksService(sdk);
  const usersService = createUsersService(sdk);

  /**
   * Package the services in an object
   */
  const services: ServicesContextInterface = useMemo(
    () => ({
      tasksService,
      usersService,
    }),
    [tasksService, usersService],
  );

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
    queryClient,
    services,
    models,
  };
};
