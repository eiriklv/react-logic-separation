import { useContext } from "react";
import { ModelsContext } from "../../providers/models.provider";
import { AppContext } from "./App.view.context";

/**
 * TODO: Move this into the containers folder,
 * and let the Root component live in the root folder instead
 * (and also give it a view model)
 *
 * index.tsx should render the root only
 */
export function App() {
  // Get dependencies
  const { useAppViewModel, Actions, Filters, TaskList } =
    useContext(AppContext);

  /**
   * The app view owns the tasks and users models,
   * which is then provided via context for consumption
   * futher down the tree
   */
  const { models } = useAppViewModel();

  return (
    <ModelsContext.Provider value={models}>
      <div>
        <Actions />
        <Filters />
        <TaskList />
      </div>
    </ModelsContext.Provider>
  );
}
