import { sleep } from "../../../../lib/utils";
import { Task } from "../types";
import { ITasksService } from "./tasks.service";
import defaultDependencies, {
  TasksServiceDependencies,
} from "./tasks.service.dependencies";

/**
 * Fake delay
 */
const serviceDelayInMs = 0;

export class TasksServiceMock implements ITasksService {
  private _tasks: Task[];

  private _dependencies: TasksServiceDependencies;

  constructor(
    dependencies: TasksServiceDependencies = defaultDependencies,
    initialTasks?: Task[],
  ) {
    this._dependencies = dependencies;
    this._tasks = initialTasks?.slice() ?? [];
  }

  public async listTasks() {
    await sleep(serviceDelayInMs);
    return this._tasks.slice();
  }

  public async addTask(text: string, ownerId: string) {
    await sleep(serviceDelayInMs);

    const newTask = {
      id: this._dependencies.generateId(),
      text,
      ownerId,
    };

    this._tasks.splice(0, this._tasks.length, ...this._tasks, newTask);

    return newTask;
  }

  public async deleteTask(taskId: string) {
    await sleep(serviceDelayInMs);

    this._tasks.splice(
      0,
      this._tasks.length,
      ...this._tasks.filter((task) => task.id !== taskId),
    );
  }
}

// Service factory
export const createTasksServiceMock = (
  ...args: ConstructorParameters<typeof TasksServiceMock>
): ITasksService => new TasksServiceMock(...args);
