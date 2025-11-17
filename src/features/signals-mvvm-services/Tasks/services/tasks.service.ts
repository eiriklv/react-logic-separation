import { ISdk } from "../sdks/sdk";
import { Task } from "../types";
import defaultDependencies, {
  TasksServiceDependencies,
} from "./tasks.service.dependencies";

/**
 * Services are typically things like SDKs, APIs or other classes that
 * expose a bunch of methods to interact with some internal state,
 * which might reside on the client and/or the server through some network layer
 *
 * Services will often interact with an sdk or directly with an API, so that
 * testing a service will often involve either using a mock for the SDK,
 * or things like mock-service-worker or nock (mocking the network layer)
 */
export interface ITasksService {
  listTasks(): Promise<Task[]>;
  addTask(text: string, ownerId: string): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
}

export class TasksService implements ITasksService {
  private _sdk: ISdk;
  private _dependencies: TasksServiceDependencies;

  constructor(sdk: ISdk, dependencies?: TasksServiceDependencies) {
    this._sdk = sdk;

    this._dependencies = {
      ...defaultDependencies,
      ...dependencies,
    };
  }

  public async listTasks() {
    return this._sdk.listTasks();
  }

  public async addTask(text: string, ownerId: string) {
    const newTask: Task = {
      id: this._dependencies.generateId(),
      text,
      ownerId,
    };

    await this._sdk.upsertTask(newTask);

    return newTask;
  }

  public async deleteTask(taskId: string) {
    await this._sdk.deleteTask(taskId);
  }
}

// Service factory
export const createTasksService = (
  ...args: ConstructorParameters<typeof TasksService>
): ITasksService => new TasksService(...args);
