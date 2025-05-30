import { ITasksService } from "../services/tasks.service";

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

export interface IDeleteTaskCommand {
  (taskId: string): Promise<void>;
}

export type DeleteTaskCommandDependencies = {
  tasksService: Pick<ITasksService, "deleteTask">;
};

export const createDeleteTaskCommand = (
  dependencies: DeleteTaskCommandDependencies,
): IDeleteTaskCommand => {
  return (taskId: string) => {
    return dependencies.tasksService.deleteTask(taskId);
  };
};
