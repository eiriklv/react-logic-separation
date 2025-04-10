import { QueryClientProvider } from "@tanstack/react-query";
import { CommandsContext } from "../../providers/commands.provider";
import { useContext } from "react";
import { RootContext } from "./Root.view.context";

/**
 * Root container, where all global providers are added
 *
 * In this case the Root is the owner of the commands,
 * which makes it responsible for both constructing them
 * and providing them to the rest of the tree below
 */
export function Root() {
  // Get dependencies
  const { useRootViewModel, App } = useContext(RootContext);

  const { commands, queryClient } = useRootViewModel();

  return (
    <QueryClientProvider client={queryClient}>
      <CommandsContext.Provider value={commands}>
        <App />
      </CommandsContext.Provider>
    </QueryClientProvider>
  );
}
