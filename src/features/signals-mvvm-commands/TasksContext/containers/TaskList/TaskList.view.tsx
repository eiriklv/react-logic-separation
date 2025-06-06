import { useContext } from "react";
import { TaskListContext } from "./TaskList.view.context";

export function TaskList() {
  // Get dependencies
  const { useTaskListViewModel, TaskItem } = useContext(TaskListContext);

  // Use the view model (state and commands)
  const {
    tasks = [],
    tasksCount,
    isLoading,
    isFetching,
    isSaving,
  } = useTaskListViewModel();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskElements = tasks.map((task) => (
    <TaskItem key={task.id} task={task}></TaskItem>
  ));

  return (
    <div>
      <h3>
        Tasks <span>{isSaving && "(saving...)"}</span>
      </h3>
      <h4>Count: {tasksCount}</h4>
      <ul>{taskElements}</ul>
      {isFetching && <div>wait...</div>}
    </div>
  );
}
