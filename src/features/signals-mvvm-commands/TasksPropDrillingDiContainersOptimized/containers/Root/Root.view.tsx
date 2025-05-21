import { QueryClientProvider } from "@tanstack/react-query";
import { CommandsContext } from "../../providers/commands.provider";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";

/**
 * Here's where we wrap all the top level providers
 * that should be available to the entire app tree.
 *
 * Things like:
 * - Query client
 * - Authentication
 * - Services
 * - Flags
 * - Metrics
 * - Internationalization
 */

type Props = {
  dependencies?: RootDependencies;
};

export function Root({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const { useRootViewModel, App } = dependencies;

  const { queryClient, commands } = useRootViewModel();

  return (
    <QueryClientProvider client={queryClient}>
      <CommandsContext.Provider value={commands}>
        <App />
      </CommandsContext.Provider>
    </QueryClientProvider>
  );
}
