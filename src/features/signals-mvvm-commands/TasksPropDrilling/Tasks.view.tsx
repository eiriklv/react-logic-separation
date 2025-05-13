import { Actions } from "./containers/Actions/Actions.view";
import { Filters } from "./containers/Filters/Filters.view";
import { TaskList } from "./containers/TaskList/TaskList.view";

export type TasksDependencies = {
  Actions: typeof Actions;
  Filters: typeof Filters;
  TaskList: typeof TaskList;
};

type Props = {
  dependencies?: TasksDependencies;
};

export function Tasks({
  dependencies = {
    Actions,
    Filters,
    TaskList,
  },
}: Props) {
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
