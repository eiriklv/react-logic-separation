import { Task } from "../../types";
import { useTaskItemViewModel } from "./TaskItem.view-model";

export type TaskItemDependencies = {
  useTaskItemViewModel: typeof useTaskItemViewModel;
};

type Props = {
  dependencies?: TaskItemDependencies;
  task: Task;
};

export function TaskItem({
  dependencies = {
    useTaskItemViewModel,
  },
  task,
}: Props) {
  const { useTaskItemViewModel } = dependencies;
  const { user, deleteTask } = useTaskItemViewModel({ task });

  return (
    <li>
      {task.text} {user?.name || "loading user..."}{" "}
      <button onClick={deleteTask}>X</button>
    </li>
  );
}
