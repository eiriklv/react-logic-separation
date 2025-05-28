import {
  ITasksService,
  tasksServiceSingleton,
} from "../services/tasks.service";
import { Task } from "../types";

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

export interface IListTasksCommandInvocation {
  (): Promise<Task[]>;
}

interface IListTasksCommand {
  invoke: IListTasksCommandInvocation;
}

export type ListTasksCommandDependencies = {
  tasksService: Pick<ITasksService, "listTasks">;
};

const defaultDependencies: ListTasksCommandDependencies = {
  tasksService: tasksServiceSingleton,
};

export class ListTasksCommand implements IListTasksCommand {
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

// Command factory
export const createListTasksCommand = (
  ...args: ConstructorParameters<typeof ListTasksCommand>
): IListTasksCommandInvocation => new ListTasksCommand(...args).invoke;
