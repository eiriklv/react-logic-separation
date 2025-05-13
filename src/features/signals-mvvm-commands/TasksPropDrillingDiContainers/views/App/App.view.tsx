import { ModelsContext } from "../../providers/models.provider";
import { Actions } from "../Actions/Actions.view";
import { Filters } from "../Filters/Filters.view";
import { TaskList } from "../TaskList/TaskList.view";
import { useAppViewModel } from "./App.view-model";

export type AppDependencies = {
  useAppViewModel: typeof useAppViewModel;
  Actions: typeof Actions;
  Filters: typeof Filters;
  TaskList: typeof TaskList;
};

type Props = {
  dependencies?: AppDependencies;
};

/**
 * TODO: Move this into the containers folder,
 * and let the Root component live in the root folder instead
 * (and also give it a view model)
 *
 * index.tsx should render the root only
 */
export function App({
  dependencies = {
    useAppViewModel,
    Actions,
    Filters,
    TaskList,
  },
}: Props) {
  // Get dependencies
  const { useAppViewModel, Actions, Filters, TaskList } = dependencies;

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
