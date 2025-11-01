import { Task } from "../../types";
import defaultDependencies, {
  TaskItemDependencies,
} from "./TaskItem.view.dependencies";

type Props = {
  dependencies?: TaskItemDependencies;
  task: Task;
};

export function TaskItem({ dependencies = defaultDependencies, task }: Props) {
  // Get dependencies
  const { useTaskItemViewModel } = dependencies;

  const { user, deleteTask } = useTaskItemViewModel({ task });

  return (
    <li>
      {task.text} {user?.name || "loading user..."}{" "}
      <button onClick={deleteTask}>X</button>
    </li>
  );
}
