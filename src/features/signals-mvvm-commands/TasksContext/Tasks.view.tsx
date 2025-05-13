import { useContext } from "react";
import { TasksContext } from "./Tasks.view.context";

export function Tasks() {
  // Get dependencies
  const { Actions, Filters, TaskList } = useContext(TasksContext);

  return (
    <div>
      <Actions />
      <Filters />
      <TaskList />
    </div>
  );
}
