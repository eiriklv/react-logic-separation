import { Task } from "../types";
import { createTasksService } from "./tasks.service";
import { TasksServiceDependencies } from "./tasks.service.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./tasks.service.dependencies", () => ({ default: {} }));

describe("Tasks Service", () => {
  it("should reflect the initial value", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksServiceDependencies: TasksServiceDependencies = {
      generateId: vi.fn(() => "abc"),
      delay: 0,
    };

    const tasksService = createTasksService(
      tasksServiceDependencies,
      initialTasks,
    );

    // act
    const tasks = await tasksService.listTasks();

    // assert
    expect(tasks).toEqual(initialTasks);
  });

  it("should reflect added tasks", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksServiceDependencies: TasksServiceDependencies = {
      generateId: vi.fn(() => "abc"),
      delay: 0,
    };

    const tasksService = createTasksService(
      tasksServiceDependencies,
      initialTasks,
    );

    // act
    await tasksService.addTask("New task", "user-1");
    const tasks = await tasksService.listTasks();

    // assert
    expect(tasks).toEqual([{ id: "abc", text: "New task", ownerId: "user-1" }]);
  });

  it("should reflect deleted tasks", async () => {
    // arrange
    const initialTasks: Task[] = [
      { id: "abc", text: "New task", ownerId: "user-1" },
    ];

    const tasksServiceDependencies: TasksServiceDependencies = {
      generateId: vi.fn(() => "abc"),
      delay: 0,
    };

    const tasksService = createTasksService(
      tasksServiceDependencies,
      initialTasks,
    );

    // act
    await tasksService.deleteTask("abc");
    const tasks = await tasksService.listTasks();

    // assert
    expect(tasks).toEqual([]);
  });
});
