import { useQueryClient } from "@tanstack/react-query";
import { IGetUserCommand } from "../../commands/get-user.command";
import { ITasksModel } from "../../models/tasks.model";
import { createUserModel, IUserModel } from "../../models/user.model";
import { useCommands } from "../../providers/commands.provider";
import { useModels } from "../../providers/models.provider";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

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

export type TaskItemViewModelDependencies = {
  createUserModel: (
    ...args: Parameters<typeof createUserModel>
  ) => Pick<IUserModel, "user">;
  useModels: () => ModelsDependencies;
  useCommands: () => CommandsDependencies;
  useQueryClient: typeof useQueryClient;
};

const defaultDependencies: TaskItemViewModelDependencies = {
  createUserModel,
  useModels,
  useCommands,
  useQueryClient,
};

export default defaultDependencies;
