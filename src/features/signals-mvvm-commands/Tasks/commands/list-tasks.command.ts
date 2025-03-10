import { tasksServiceSingleton } from "../services/tasks.service";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Command handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with a much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  tasksService: tasksServiceSingleton,
};

export type ListTasksCommandDependencies = typeof defaultDependencies;

export class ListTasksCommand {
  private _dependencies: ListTasksCommandDependencies;

  public invoke = () => {
    return this._dependencies.tasksService.listTasks();
  };

  constructor(
    dependencies: ListTasksCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }
}

export const listTasksCommand = new ListTasksCommand().invoke;
