import { Task } from "../types";
import { TasksModelDependencies, useTasksModel } from "./tasks.model";
import { createQueryClient } from "../utils/create-query-client";
import { createTasksServiceMock } from "../services/tasks.service.mock";
import { renderHook } from "@testing-library/react";

describe("TasksModel", () => {
  it("should work as expected when adding a single task", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    const mockDependencies: TasksModelDependencies = {
      tasksService,
    };

    const queryClient = createQueryClient();

    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks were loaded
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));

    // add some tasks
    await result.current.addTask("Solve some hard bug", "user-1");

    // check that the list of tasks is correct
    await vi.waitFor(() =>
      expect(result.current.tasks).toEqual([
        {
          id: expect.any(String),
          ownerId: "user-1",
          text: "Solve some hard bug",
        },
      ]),
    );
  });

  it("should work as expected when adding multiple tasks", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    const mockDependencies: TasksModelDependencies = {
      tasksService,
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks were loaded
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));

    // add some tasks
    await result.current.addTask("Paint house", "user-1");
    await result.current.addTask("Buy milk", "user-1");
    await result.current.addTask("Wash car", "user-1");

    // check that the list of tasks is correct
    await vi.waitFor(() =>
      expect(result.current.tasks).toEqual([
        {
          id: expect.any(String),
          text: "Paint house",
          ownerId: "user-1",
        },
        {
          id: expect.any(String),
          text: "Buy milk",
          ownerId: "user-1",
        },
        {
          id: expect.any(String),
          text: "Wash car",
          ownerId: "user-1",
        },
      ]),
    );
  });

  it("should work as expected when deleting a task", async () => {
    // arrange
    const initialTasks: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
    ];

    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    const mockDependencies: TasksModelDependencies = {
      tasksService,
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks were loaded
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));

    // add some tasks
    await result.current.deleteTask("1");

    // check that the list of tasks is correct
    await vi.waitFor(() => expect(result.current.tasks).toEqual([]));
  });

  it("should not perform deletion if no task id is provided", async () => {
    // arrange
    const initialTasks: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
    ];

    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    const mockDependencies: TasksModelDependencies = {
      tasksService,
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks were loaded
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));

    // add some tasks
    await expect(() => result.current.deleteTask("")).rejects.toThrowError(
      "Task id must be provided",
    );

    // check that the list of tasks is correct
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));
  });

  it("should fail validation when adding empty task", async () => {
    // arrange
    const initialTasks: Task[] = [];

    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    const mockDependencies: TasksModelDependencies = {
      tasksService,
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks were loaded
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));

    // check that adding a task without a category fails
    await expect(() =>
      result.current.addTask("Thing", ""),
    ).rejects.toThrowError("Owner id for task is missing");

    // check that adding a task without text fails
    await expect(() =>
      result.current.addTask("", "user-1"),
    ).rejects.toThrowError("Task text is missing");

    // check that the list of tasks is still the same as before
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));
  });

  it("should provide tasks and counts filtered by category correctly", async () => {
    // arrange
    const initialTasks: Task[] = [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ];

    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    const mockDependencies: TasksModelDependencies = {
      tasksService,
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );
    let selectedOwnerId = "user-1";

    // check that the tasks were loaded
    await vi.waitFor(() => expect(result.current.tasks).toEqual(initialTasks));

    // create a reference to tasks filtered by category
    const {
      result: useTasksByOwnerIdResult,
      rerender: rerenderuseTasksByOwnerId,
    } = renderHook(() => result.current.useTasksByOwnerId(selectedOwnerId));

    // check that correct filtered tasks are provided
    await vi.waitFor(() =>
      expect(useTasksByOwnerIdResult.current).toEqual([
        { id: "1", text: "Task 1", ownerId: "user-1" },
        { id: "2", text: "Task 2", ownerId: "user-1" },
      ]),
    );

    // change the selected category
    selectedOwnerId = "user-2";
    rerenderuseTasksByOwnerId(selectedOwnerId);

    // check that correct filtered tasks are provided
    await vi.waitFor(() =>
      expect(useTasksByOwnerIdResult.current).toEqual([
        { id: "3", text: "Task 3", ownerId: "user-2" },
        { id: "4", text: "Task 4", ownerId: "user-2" },
      ]),
    );
  });
});
