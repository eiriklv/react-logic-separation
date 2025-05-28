import { ITasksService } from "../services/tasks.service";
import type { Task } from "../types";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Commands handle things like validation, transformation, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

export interface IAddTaskCommand {
  (text: string, ownerId: string): Promise<Task>;
}

export type AddTaskCommandDependencies = {
  tasksService: Pick<ITasksService, "addTask">;
};

export const createAddTaskCommand = (
  dependencies: AddTaskCommandDependencies,
): IAddTaskCommand => {
  return (text: string, ownerId: string) => {
    if (!text) {
      throw new Error("Task text is missing");
    }

    if (!ownerId) {
      throw new Error("Owner id for task is missing");
    }

    return dependencies.tasksService.addTask(text, ownerId);
  };
};
