import { Task } from "../types";

export interface ISdk {
  listTasks(): Promise<Task[]>;
  upsertTask(task: Task): Promise<Task>;
  deleteTask(taskId: string): Promise<string>;
}

class Sdk implements ISdk {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async listTasks(): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/api/tasks`);
    const tasks = await response.json();
    return tasks;
  }

  async upsertTask(task: Task): Promise<Task> {
    await fetch(`${this.baseUrl}/api/tasks`, {
      body: JSON.stringify(task),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return task;
  }

  async deleteTask(taskId: string): Promise<string> {
    await fetch(`${this.baseUrl}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return taskId;
  }
}

// Service factory
export const createSdk = (...args: ConstructorParameters<typeof Sdk>): ISdk =>
  new Sdk(...args);
