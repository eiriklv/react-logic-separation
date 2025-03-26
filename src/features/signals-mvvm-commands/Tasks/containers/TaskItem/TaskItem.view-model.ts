import { useCallback, useContext, useMemo } from "react";
import { TaskItemViewModelContext } from "./TaskItem.view-model.context";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import { Task } from "../../types";

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by providing custom hooks with appropriate
 * interfaces - taking care not to expose
 * implementation details of the business
 * logic itself or libraries used
 *
 * It can also be used for 3rd party library hooks,
 * so that you avoid coupling your component directly.
 * Instead you can provide a nice interface and map
 * the custom hooks into it
 */
type TaskItemViewModelProps = {
  task: Task;
};

export const useTaskItemViewModel = ({ task }: TaskItemViewModelProps) => {
  const { tasksModel, createUserModel } = useContext(TaskItemViewModelContext);

  const userModel = useMemo(
    () => createUserModel(task.ownerId),
    [createUserModel, task.ownerId],
  );

  const deleteTask = useCallback(() => {
    return tasksModel.deleteTask(task.id);
  }, [task.id, tasksModel]);

  return {
    user: useSignalValue(userModel.user),
    deleteTask,
  };
};
