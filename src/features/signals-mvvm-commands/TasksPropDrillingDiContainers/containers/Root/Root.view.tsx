import { QueryClientProvider } from "@tanstack/react-query";
import { useRootViewModel } from "./Root.view-model";
import { CommandsContext } from "../../providers/commands.provider";
import { App } from "../../views/App/App.view";

/**
 * TODO: Here is where the global providers
 * need to be initialized (potentially in the view model of this)
 *
 * - Models
 * - Commands
 * - Flags
 * - Etc..
 */
export type RootDependencies = {
  useRootViewModel: typeof useRootViewModel;
  App: typeof App;
};

type Props = {
  dependencies?: RootDependencies;
};

export function Root({
  dependencies = {
    useRootViewModel,
    App,
  },
}: Props = {}) {
  // Get dependencies
  const { useRootViewModel, App } = dependencies;

  const { commands, queryClient } = useRootViewModel();

  /**
   * TODO: Create a container where we inject the commands
   * for consumption further down the tree
   */
  return (
    <QueryClientProvider client={queryClient}>
      <CommandsContext.Provider value={commands}>
        <App />
      </CommandsContext.Provider>
    </QueryClientProvider>
  );
}
