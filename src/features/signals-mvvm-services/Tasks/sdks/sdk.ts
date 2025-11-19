import { Task, User } from "../types";

export interface ISdk {
  listUsers(): Promise<User[]>;
  retrieveUserById(userId: string): Promise<User>;
  listTasks(): Promise<Task[]>;
  upsertTask(task: Task): Promise<Task>;
  deleteTask(taskId: string): Promise<string>;
}

class Sdk implements ISdk {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async listUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/api/users`);
    const users = await response.json();
    return users;
  }

  async retrieveUserById(userId: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/users/${userId}`);
    const user = await response.json();
    return user;
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
