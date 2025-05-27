import { sleep } from "../../../../lib/utils";
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

const defaultTasks: Task[] = [
  { id: "1", text: "Write self reflection", ownerId: "user-1" },
  { id: "2", text: "Fix that bug", ownerId: "user-2" },
];

export class TasksService implements ITasksService {
  private _tasks: Task[];

  private _dependencies: TasksServiceDependencies;

  constructor(
    dependencies: TasksServiceDependencies = defaultDependencies,
    initialTasks: Task[] = defaultTasks,
  ) {
    this._dependencies = dependencies;
    this._tasks = initialTasks;
  }

  public async listTasks() {
    await sleep(this._dependencies.delay);
    return this._tasks.slice();
  }

  public async addTask(text: string, ownerId: string) {
    await sleep(this._dependencies.delay);

    const newTask = {
      id: this._dependencies.generateId(),
      text,
      ownerId,
    };

    this._tasks.splice(0, this._tasks.length, ...this._tasks, newTask);

    return newTask;
  }

  public async deleteTask(taskId: string) {
    await sleep(this._dependencies.delay);

    this._tasks.splice(
      0,
      this._tasks.length,
      ...this._tasks.filter((task) => task.id !== taskId),
    );
  }
}

// Service factory
export const createTasksService = (
  ...args: ConstructorParameters<typeof TasksService>
): ITasksService => new TasksService(...args);
