import { QueryClientProvider } from "@tanstack/react-query";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { ServicesProvider } from "../../providers/services.provider";
import { ModelsProvider } from "../../providers/models.provider";

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

  const { queryClient, services, models } = useRootViewModel();

  return (
    <QueryClientProvider client={queryClient}>
      <ServicesProvider services={services}>
        <ModelsProvider models={models}>
          <App />
        </ModelsProvider>
      </ServicesProvider>
    </QueryClientProvider>
  );
}
