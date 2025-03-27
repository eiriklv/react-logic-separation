import { tasksServiceSingleton } from "../services/tasks.service";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Command handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  tasksService: tasksServiceSingleton,
};

export type DeleteTaskCommandDependencies = typeof defaultDependencies;

export class DeleteTaskCommand {
  private _dependencies: DeleteTaskCommandDependencies;

  public invoke = (taskId: string) => {
    return this._dependencies.tasksService.deleteTask(taskId);
  };

  constructor(
    dependencies: DeleteTaskCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }
}

export const deleteTaskCommand = new DeleteTaskCommand().invoke;
