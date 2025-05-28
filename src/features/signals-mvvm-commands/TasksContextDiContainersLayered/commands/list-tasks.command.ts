import { ITasksService } from "../services/tasks.service";
import type { Task } from "../types";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Commands handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

export interface IListTasksCommand {
  (): Promise<Task[]>;
}

export type ListTasksCommandDependencies = {
  tasksService: Pick<ITasksService, "listTasks">;
};

// Command factory
export const createListTasksCommand = (
  dependencies: ListTasksCommandDependencies,
): IListTasksCommand => {
  return () => {
    return dependencies.tasksService.listTasks();
  };
};
