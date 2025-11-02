import { Task } from "../types";
import { createTasksService } from "./tasks.service";
import { TasksServiceDependencies } from "./tasks.service.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time and side-effects
 */
vi.mock("./tasks.service.dependencies", () => ({ default: {} }));

describe("Tasks Service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should reflect the initial value", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksServiceDependencies: TasksServiceDependencies = {
      generateId: vi.fn(() => "abc"),
    };

    const tasksService = createTasksService(
      tasksServiceDependencies,
      initialTasks,
    );

    // act
    const tasksPromise = tasksService.listTasks();
    await vi.runAllTimersAsync();
    const tasks = await tasksPromise;

    // assert
    expect(tasks).toEqual(initialTasks);
  });

  it("should reflect added tasks", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksServiceDependencies: TasksServiceDependencies = {
      generateId: vi.fn(() => "abc"),
    };

    const tasksService = createTasksService(
      tasksServiceDependencies,
      initialTasks,
    );

    // act
    const addTaskPromise = tasksService.addTask("New task", "user-1");
    await vi.runAllTimersAsync();
    await addTaskPromise;

    const tasksPromise = tasksService.listTasks();
    await vi.runAllTimersAsync();
    const tasks = await tasksPromise;

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
    };

    const tasksService = createTasksService(
      tasksServiceDependencies,
      initialTasks,
    );

    // act
    const deleteTaskPromise = tasksService.deleteTask("abc");
    await vi.runAllTimersAsync();
    await deleteTaskPromise;

    const tasksPromise = tasksService.listTasks();
    await vi.runAllTimersAsync();
    const tasks = await tasksPromise;

    // assert
    expect(tasks).toEqual([]);
  });
});
