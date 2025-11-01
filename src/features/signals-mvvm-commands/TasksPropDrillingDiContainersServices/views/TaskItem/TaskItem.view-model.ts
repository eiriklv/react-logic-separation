import { useCallback, useMemo } from "react";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import { Task } from "../../types";
import defaultDependencies, {
  TaskItemViewModelDependencies,
} from "./TaskItem.view-model.dependencies";

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

export type TaskItemViewModelProps = {
  dependencies?: TaskItemViewModelDependencies;
  task: Task;
};

export const useTaskItemViewModel = ({
  dependencies = defaultDependencies,
  task,
}: TaskItemViewModelProps) => {
  // Get dependencies
  const { createUserModel, useServices, useModels, useQueryClient } =
    dependencies;

  // Get services from the shared command provider
  const services = useServices();

  // Get models from the shared models provider
  const models = useModels();

  // Get the query client
  const queryClient = useQueryClient();

  // Pull out the stuff we want from the shared models
  const { tasksModel } = models;

  // Pull out the stuff we need from the shared services
  const { usersService } = services;

  const userModel = useMemo(
    () => createUserModel(task.ownerId, queryClient, { usersService }),
    [createUserModel, usersService, queryClient, task.ownerId],
  );

  const deleteTask = useCallback(() => {
    return tasksModel.deleteTask(task.id);
  }, [task.id, tasksModel]);

  return {
    user: useSignalValue(userModel.user),
    deleteTask,
  };
};
