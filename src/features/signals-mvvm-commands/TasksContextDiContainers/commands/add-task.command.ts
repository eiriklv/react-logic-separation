import {
  ITasksService,
  tasksServiceSingleton,
} from "../services/tasks.service";
import { Task } from "../types";

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

export interface IAddTaskCommandInvocation {
  (text: string, ownerId: string): Promise<Task>;
}

interface IAddTaskCommand {
  invoke: IAddTaskCommandInvocation;
}

export type AddTaskCommandDependencies = {
  tasksService: Pick<ITasksService, "addTask">;
};

const defaultDependencies: AddTaskCommandDependencies = {
  tasksService: tasksServiceSingleton,
};

export class AddTaskCommand implements IAddTaskCommand {
  private _dependencies: AddTaskCommandDependencies;

  public invoke = (text: string, ownerId: string) => {
    if (!text) {
      throw new Error("Task text is missing");
    }

    if (!ownerId) {
      throw new Error("Owner id for task is missing");
    }

    return this._dependencies.tasksService.addTask(text, ownerId);
  };

  constructor(dependencies: AddTaskCommandDependencies = defaultDependencies) {
    this._dependencies = dependencies;
  }
}

// Command factory
export const createAddTaskCommand = (
  ...args: ConstructorParameters<typeof AddTaskCommand>
): IAddTaskCommandInvocation => new AddTaskCommand(...args).invoke;
