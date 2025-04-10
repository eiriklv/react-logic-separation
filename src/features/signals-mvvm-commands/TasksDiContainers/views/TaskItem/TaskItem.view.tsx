import { useContext } from "react";
import { Task } from "../../types";
import { TaskItemContext } from "./TaskItem.view.context";

type Props = {
  task: Task;
};

export function TaskItem({ task }: Props) {
  // Get dependencies
  const { useTaskItemViewModel } = useContext(TaskItemContext);

  const { user, deleteTask } = useTaskItemViewModel({ task });

  return (
    <li>
      {task.text} {user?.name || "loading user..."}{" "}
      <button onClick={deleteTask}>X</button>
    </li>
  );
}
