import { QueryClientProvider } from "@tanstack/react-query";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { ServicesContext } from "../../providers/services.provider";

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
 */
export function Root({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const { useRootViewModel, App } = dependencies;

  const { queryClient, services } = useRootViewModel();

  return (
    <QueryClientProvider client={queryClient}>
      <ServicesContext.Provider value={services}>
        <App />
      </ServicesContext.Provider>
    </QueryClientProvider>
  );
}
