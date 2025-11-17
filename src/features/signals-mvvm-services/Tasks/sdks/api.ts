import { Task } from "../types";

export async function listTasks(): Promise<Task[]> {
  const response = await fetch("https://my-service.com/api/tasks");
  const tasks = await response.json();
  return tasks;
}

export async function upsertTask(task: Task): Promise<Task> {
  await fetch("https://my-service.com/api/tasks", {
    body: JSON.stringify(task),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return task;
}

export async function deleteTask(taskId: string): Promise<string> {
  await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return taskId;
}
