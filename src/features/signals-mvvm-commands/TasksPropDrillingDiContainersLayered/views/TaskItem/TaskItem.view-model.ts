import { useCallback, useMemo } from "react";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import { Task } from "../../types";
import { useModels } from "../../providers/models.provider";
import { useQueryClient } from "@tanstack/react-query";
import { useCommands } from "../../providers/commands.provider";
import defaultDependencies, {
  TaskItemViewModelDependencies,
} from "./TaskItem.view-model.dependencies";
import { ITasksModel } from "../../models/tasks.model";
import { IGetUserCommand } from "../../commands/get-user.command";

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

/**
 * Specify which subset of models
 * we depend on in this module
 */
export type ModelsDependencies = {
  tasksModel: Pick<ITasksModel, "deleteTask">;
};

/**
 * Specify which subset of commands
 * we depend on in this module
 */
export type CommandsDependencies = {
  getUserCommand: IGetUserCommand;
};

export const useTaskItemViewModel = ({
  dependencies = defaultDependencies,
  task,
}: TaskItemViewModelProps) => {
  // Get dependencies
  const { createUserModel } = dependencies;

  // Get commands from the shared command provider
  const commands: CommandsDependencies = useCommands();

  // Get models from the shared models provider
  const models: ModelsDependencies = useModels();

  // Get the query client
  const queryClient = useQueryClient();

  // Pull out the stuff we want from the shared models
  const { tasksModel } = models;

  // Pull out the stuff we need from the shared commands
  const { getUserCommand } = commands;

  const userModel = useMemo(
    () => createUserModel(task.ownerId, queryClient, { getUserCommand }),
    [createUserModel, getUserCommand, queryClient, task.ownerId],
  );

  const deleteTask = useCallback(() => {
    return tasksModel.deleteTask(task.id);
  }, [task.id, tasksModel]);

  return {
    user: useSignalValue(userModel.user),
    deleteTask,
  };
};
