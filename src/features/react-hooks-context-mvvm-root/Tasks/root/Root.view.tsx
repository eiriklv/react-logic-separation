import { QueryClientProvider } from "@tanstack/react-query";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { ServicesProvider } from "../providers/services.provider";
import { ModelsProvider } from "../providers/models.provider";
import { ModelsContextInterface } from "../providers/models.provider";
import { useMemo } from "react";
import { ServicesContextInterface } from "../providers/services.provider";

/**
 * Here's where we wrap all the top level providers
 * that should be available to the entire app tree.
 *
 * Things like:
 * - Query client
 * - Services
 * - Authentication
 * - Services
 * - Flags
 * - Metrics
 * - Internationalization
 *
 * TODO: Provide everything as services?
 */

type Props = {
  dependencies?: RootDependencies;
};

/**
 * Root container, where all global providers are added
 *
 * In this case the Root is the owner of the services,
 * which makes it responsible for both constructing them
 * and providing them to the rest of the tree below
 *
 * The same goes for any shared domain models - they're
 * constructed and owned by the root view / view model
 * and provided to the rest of the application tree.
 *
 * Any routing or similar would happen in the <App> component and below
 */
export function Root({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const {
    App,
    Router, // TODO: Move routing to app view
    baseUrl,
    createSdk,
    createQueryClient,
    createTasksService,
    createUsersService,
    useTasksModel,
    useUsersModel,
    useSelectedFiltersModel,
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
  const queryClient = useMemo(() => createQueryClient(), [createQueryClient]);

  /**
   * Create the SDK client
   *
   * TODO(eirikv): Inject the base url somehow
   * (via environment and dependency injection)
   */
  const sdk = useMemo(() => createSdk(baseUrl), [createSdk, baseUrl]);

  /**
   * Create service instances
   *
   * NOTE: The only way IO can be performed
   * is via services - no other way is allowed.
   *
   * Anything doing IO (network, storage, etc)
   * must be wrapped in a service and then exposed.
   */
  const tasksService = useMemo(
    () => createTasksService(sdk),
    [createTasksService, sdk],
  );
  const usersService = useMemo(
    () => createUsersService(sdk),
    [createUsersService, sdk],
  );

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
  const usersModel = useUsersModel(queryClient, services);
  const tasksModel = useTasksModel(queryClient, services);
  const selectedFiltersModel = useSelectedFiltersModel();

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

  return (
    <QueryClientProvider client={queryClient}>
      <ServicesProvider value={services}>
        <ModelsProvider value={models}>
          <Router>
            <App />
          </Router>
        </ModelsProvider>
      </ServicesProvider>
    </QueryClientProvider>
  );
}
