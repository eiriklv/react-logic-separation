import { useCallback, useContext, useMemo } from "react";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import { Task } from "../../types";
import {
  ModelsContextInterface,
  useModels,
} from "../../providers/models.provider";
import { useQueryClient } from "@tanstack/react-query";
import {
  CommandsContextInterface,
  useCommands,
} from "../../providers/commands.provider";
import { TaskItemViewModelContext } from "./TaskItem.view-model.context";
import { PickDeep } from "type-fest";

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
  task: Task;
};

export type ModelsDependencies = PickDeep<
  ModelsContextInterface,
  "tasksModel.deleteTask"
>;

export type CommandsDependencies = PickDeep<
  CommandsContextInterface,
  "getUserCommand"
>;

export const useTaskItemViewModel = ({ task }: TaskItemViewModelProps) => {
  // Get dependencies
  const { createUserModel } = useContext(TaskItemViewModelContext);

  // Get commands from the shared command provider
  const commands = useCommands<CommandsDependencies>();

  // Get models from the shared models provider
  const models = useModels<ModelsDependencies>();

  // Get the query client
  const queryClient = useQueryClient();

  // Pull out the stuff we want from the shared models
  const { tasksModel } = models;

  // Pull out the stuff we need from the shared commands
  const { getUserCommand } = commands;

  // Create the user model instance (per view)
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
