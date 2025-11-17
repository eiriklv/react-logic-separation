import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Task } from "../types";
import { deleteTask, listTasks, upsertTask } from "./api";

export const defaultHandlers = [];
export const server = setupServer(...defaultHandlers);

describe("API", () => {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: "error",
    }),
  );
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("listTasks", () => {
    it("should work as expected", async () => {
      // Arrange
      const mockTasks: Task[] = [
        { id: "1", text: "Task 1", ownerId: "user-1" },
        { id: "2", text: "Task 2", ownerId: "user-1" },
        { id: "3", text: "Task 3", ownerId: "user-2" },
        { id: "4", text: "Task 4", ownerId: "user-2" },
      ];

      server.use(
        http.get("https://my-service.com/api/tasks", () => {
          return HttpResponse.json<Task[]>(mockTasks);
        }),
      );

      // Act
      const tasks = await listTasks();

      // Assert
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe("upsertTask", () => {
    it("should work as expected", async () => {
      // Arrange
      const mockTask: Task = {
        id: "1",
        text: "Task 1",
        ownerId: "user-1",
      };

      server.use(
        http.post("https://my-service.com/api/tasks", () => {
          return HttpResponse.json<Task>(mockTask);
        }),
      );

      // Act
      const task = await upsertTask(mockTask);

      // Assert
      expect(task).toEqual(mockTask);
    });
  });

  describe("deleteTask", () => {
    it("should work as expected", async () => {
      // Arrange
      const mockTask: Task = {
        id: "1",
        text: "Task 1",
        ownerId: "user-1",
      };

      server.use(
        http.delete("/api/tasks/:id", () => {
          return HttpResponse.json({ message: "Deleted" }, { status: 200 });
        }),
      );

      // Act
      const deletedTaskId = await deleteTask(mockTask.id);

      // Assert
      expect(deletedTaskId).toEqual(mockTask.id);
    });
  });
});
