import {
  ITasksService,
  tasksServiceSingleton,
} from "../services/tasks.service";

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

export interface IDeleteTaskCommandInvocation {
  (taskId: string): Promise<void>;
}

interface IDeleteTaskCommand {
  invoke: IDeleteTaskCommandInvocation;
}

export type DeleteTaskCommandDependencies = {
  tasksService: Pick<ITasksService, "deleteTask">;
};

const defaultDependencies: DeleteTaskCommandDependencies = {
  tasksService: tasksServiceSingleton,
};

export class DeleteTaskCommand implements IDeleteTaskCommand {
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

// Command factory
export const createDeleteTaskCommand = (
  ...args: ConstructorParameters<typeof DeleteTaskCommand>
): IDeleteTaskCommand => new DeleteTaskCommand(...args);
