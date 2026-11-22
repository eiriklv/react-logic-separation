import { Task } from "../types";
import { ITasksService } from "./tasks.service";
import defaultDependencies, {
  TasksServiceDependencies,
} from "./tasks.service.dependencies";

export class TasksServiceMock implements ITasksService {
  private _tasks: Task[] = [];
  private _dependencies: TasksServiceDependencies;

  constructor(_sdk: unknown, dependencies?: Partial<TasksServiceDependencies>) {
    this._dependencies = {
      ...defaultDependencies,
      ...dependencies,
    };
    this._tasks = dependencies?.initialTasks?.slice() ?? [];
  }

  public async listTasks() {
    return this._tasks.slice();
  }

  public async addTask(text: string, ownerId: string) {
    const newTask = {
      id: this._dependencies.generateId(),
      text,
      ownerId,
    };

    this._tasks.splice(0, this._tasks.length, ...this._tasks, newTask);

    return newTask;
  }

  public async deleteTask(taskId: string) {
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
