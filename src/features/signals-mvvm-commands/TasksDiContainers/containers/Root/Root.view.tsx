import { QueryClientProvider } from "@tanstack/react-query";
import { CommandsContext } from "../../providers/commands.provider";
import { useContext } from "react";
import { RootContext } from "./Root.view.context";

/**
 * TODO: Here is where the global providers
 * need to be initialized (potentially in the view model of this)
 *
 * - Models
 * - Commands
 * - Flags
 * - Etc..
 */
export function Root() {
  // Get dependencies
  const { useRootViewModel, App } = useContext(RootContext);

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
