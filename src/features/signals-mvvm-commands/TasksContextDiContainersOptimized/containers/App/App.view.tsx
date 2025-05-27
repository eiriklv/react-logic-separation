import { useContext } from "react";
import { ModelsContext } from "../../providers/models.provider";
import { AppContext } from "./App.view.context";

/**
 * App container
 *
 * In this case the App is the owner of the some of shared model instances,
 * which makes it responsible for both constructing them
 * and providing them to the rest of the tree below
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
