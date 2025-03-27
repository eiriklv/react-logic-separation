import { useContext } from "react";
import { TaskItemContext } from "./TaskItem.view.context";
import { Task } from "../../types";

type Props = {
  task: Task;
};

export function TaskItem({ task }: Props) {
  const { useTaskItemViewModel } = useContext(TaskItemContext);
  const { user, deleteTask } = useTaskItemViewModel({ task });

  return (
    <li>
      {task.text} {user?.name || "loading user..."}{" "}
      <button onClick={deleteTask}>X</button>
    </li>
  );
}
