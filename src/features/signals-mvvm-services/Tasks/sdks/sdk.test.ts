import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Task, User } from "../types";
import { createSdk } from "./sdk";

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

  describe("listUsers", () => {
    it("should work as expected", async () => {
      // Arrange
      const baseUrl = "https://my-service.com";

      const mockUsers: User[] = [
        { id: "user-1", name: "User 1", profileImageUrl: "/src/user-1.jpg" },
        { id: "user-2", name: "User 2", profileImageUrl: "/src/user-2.jpg" },
      ];

      server.use(
        http.get(`${baseUrl}/api/users`, () => {
          return HttpResponse.json<User[]>(mockUsers);
        }),
      );

      // Act
      const sdk = createSdk(baseUrl);
      const users = await sdk.listUsers();

      // Assert
      expect(users).toEqual(mockUsers);
    });
  });

  describe("retrieveUserById", () => {
    it("should work as expected", async () => {
      // Arrange
      const baseUrl = "https://my-service.com";

      const mockUsers: User[] = [
        { id: "user-1", name: "User 1", profileImageUrl: "/src/user-1.jpg" },
        { id: "user-2", name: "User 2", profileImageUrl: "/src/user-2.jpg" },
      ];

      server.use(
        http.get(`${baseUrl}/api/users/${mockUsers[0].id}`, () => {
          return HttpResponse.json<User>(mockUsers[0]);
        }),
      );

      // Act
      const sdk = createSdk(baseUrl);
      const user = await sdk.retrieveUserById(mockUsers[0].id);

      // Assert
      expect(user).toEqual(mockUsers[0]);
    });
  });

  describe("listTasks", () => {
    it("should work as expected", async () => {
      // Arrange
      const baseUrl = "https://my-service.com";

      const mockTasks: Task[] = [
        { id: "1", text: "Task 1", ownerId: "user-1" },
        { id: "2", text: "Task 2", ownerId: "user-1" },
        { id: "3", text: "Task 3", ownerId: "user-2" },
        { id: "4", text: "Task 4", ownerId: "user-2" },
      ];

      server.use(
        http.get(`${baseUrl}/api/tasks`, () => {
          return HttpResponse.json<Task[]>(mockTasks);
        }),
      );

      // Act
      const sdk = createSdk(baseUrl);
      const tasks = await sdk.listTasks();

      // Assert
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe("upsertTask", () => {
    it("should work as expected", async () => {
      // Arrange
      const baseUrl = "https://my-service.com";

      const mockTask: Task = {
        id: "1",
        text: "Task 1",
        ownerId: "user-1",
      };

      server.use(
        http.post(`${baseUrl}/api/tasks`, () => {
          return HttpResponse.json<Task>(mockTask);
        }),
      );

      // Act
      const sdk = createSdk(baseUrl);
      const task = await sdk.upsertTask(mockTask);

      // Assert
      expect(task).toEqual(mockTask);
    });
  });

  describe("deleteTask", () => {
    it("should work as expected", async () => {
      // Arrange
      const baseUrl = "https://my-service.com";

      const mockTask: Task = {
        id: "1",
        text: "Task 1",
        ownerId: "user-1",
      };

      server.use(
        http.delete(`${baseUrl}/api/tasks/:id`, () => {
          return HttpResponse.json({ message: "Deleted" }, { status: 200 });
        }),
      );

      // Act
      const sdk = createSdk(baseUrl);
      const deletedTaskId = await sdk.deleteTask(mockTask.id);

      // Assert
      expect(deletedTaskId).toEqual(mockTask.id);
    });
  });
});
