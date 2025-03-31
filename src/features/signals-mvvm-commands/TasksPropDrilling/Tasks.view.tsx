import { Actions as _Actions } from "./containers/Actions/Actions.view";
import { Filters as _Filters } from "./containers/Filters/Filters.view";
import { TaskList as _TaskList } from "./containers/TaskList/TaskList.view";

export type TasksDependencies = {
  Actions: typeof _Actions;
  Filters: typeof _Filters;
  TaskList: typeof _TaskList;
};

type Props = {
  dependencies?: TasksDependencies;
};

export function Tasks({
  dependencies = {
    Actions: _Actions,
    Filters: _Filters,
    TaskList: _TaskList,
  },
}: Props = {}) {
  // Get dependencies
  const { Actions, Filters, TaskList } = dependencies;

  return (
    <div>
      <Actions />
      <Filters />
      <TaskList />
    </div>
  );
}
