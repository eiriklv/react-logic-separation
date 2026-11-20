import { Task } from "../types";
import { TasksModelDependencies, useTasksModel } from "./tasks.model";
import { createQueryClient } from "../utils/create-query-client";
import { renderHook, waitFor } from "@testing-library/react";

describe("TasksModel", () => {
  it("should work as expected when adding a single task", async () => {
    // arrange
    const initialMockedTasks: Task[] = [];
    const mockedTasksAfterAdd: Task[] = [
      { id: "1", text: "Solve some hard bug", ownerId: "user-1" },
    ];

    const mockDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi
          .fn<TasksModelDependencies["tasksService"]["listTasks"]>()
          .mockResolvedValueOnce(initialMockedTasks)
          .mockResolvedValueOnce(mockedTasksAfterAdd),
      },
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the tasks were loaded
    expect(result.current.tasks).toEqual(initialMockedTasks);
    expect(result.current.tasksCount).toEqual(0);

    // add some tasks
    await result.current.addTask("Solve some hard bug", "user-1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.addTask).toHaveBeenCalledOnce();

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(2);

    // check that the list of tasks is correct
    await waitFor(() =>
      expect(result.current.tasks).toEqual(mockedTasksAfterAdd),
    );
    expect(result.current.tasksCount).toEqual(1);
  });

  it("should work as expected when adding multiple tasks", async () => {
    // arrange
    const initialMockedTasks: Task[] = [];

    const mockedTasksAfterFirstAdd: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
    ];

    const mockedTasksAfterSecondAdd: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
      { id: "2", text: "Fake 2", ownerId: "user-2" },
    ];

    const mockedTasksAfterThirdAdd: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
      { id: "2", text: "Fake 2", ownerId: "user-2" },
      { id: "3", text: "Fake 3", ownerId: "user-3" },
    ];

    const mockDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(async (task) => task),
        deleteTask: vi.fn(),
        listTasks: vi
          .fn<TasksModelDependencies["tasksService"]["listTasks"]>()
          .mockResolvedValueOnce(initialMockedTasks)
          .mockResolvedValueOnce(mockedTasksAfterFirstAdd)
          .mockResolvedValueOnce(mockedTasksAfterSecondAdd)
          .mockResolvedValueOnce(mockedTasksAfterThirdAdd),
      },
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the tasks were loaded
    expect(result.current.tasks).toEqual(initialMockedTasks);

    // add some tasks
    await result.current.addTask("Paint house", "user-1");
    await result.current.addTask("Buy milk", "user-1");
    await result.current.addTask("Wash car", "user-1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.addTask).toHaveBeenCalledTimes(3);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(4);

    // check that the list of tasks is correct
    await waitFor(() =>
      expect(result.current.tasks).toEqual(mockedTasksAfterThirdAdd),
    );
    expect(result.current.tasksCount).toEqual(3);
  });

  it("should work as expected when deleting a task", async () => {
    // arrange
    const initialMockedTasks: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
    ];
    const mockedTasksAfterDelete: Task[] = [];

    const mockDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi
          .fn<TasksModelDependencies["tasksService"]["listTasks"]>()
          .mockResolvedValueOnce(initialMockedTasks)
          .mockResolvedValueOnce(mockedTasksAfterDelete),
      },
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the tasks were loaded
    expect(result.current.tasks).toEqual(initialMockedTasks);
    expect(result.current.tasksCount).toEqual(1);

    // add some tasks
    await result.current.deleteTask("1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.deleteTask).toHaveBeenCalledTimes(1);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(2);

    // check that the list of tasks is correct
    await waitFor(() =>
      expect(result.current.tasks).toEqual(mockedTasksAfterDelete),
    );
    expect(result.current.tasksCount).toEqual(0);
  });

  it("should not perform deletion if no task id is provided", async () => {
    // arrange
    const initialMockedTasks: Task[] = [
      { id: "1", text: "Fake 1", ownerId: "user-1" },
    ];

    const mockDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi
          .fn<TasksModelDependencies["tasksService"]["listTasks"]>()
          .mockResolvedValueOnce(initialMockedTasks),
      },
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the tasks were loaded
    expect(result.current.tasks).toEqual(initialMockedTasks);
    expect(result.current.tasksCount).toEqual(1);

    // add some tasks
    await expect(() => result.current.deleteTask("")).rejects.toThrowError(
      "Task id must be provided",
    );

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.deleteTask).toHaveBeenCalledTimes(0);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(1);

    // check that the list of tasks is correct
    expect(result.current.tasks).toEqual(initialMockedTasks);
    expect(result.current.tasksCount).toEqual(1);
  });

  it("should fail validation when adding empty task", async () => {
    // arrange
    const initialMockedTasks: Task[] = [];

    const mockDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi
          .fn<TasksModelDependencies["tasksService"]["listTasks"]>()
          .mockResolvedValueOnce(initialMockedTasks),
      },
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );

    // check that the tasks load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the tasks were loaded
    expect(result.current.tasks).toEqual(initialMockedTasks);

    // check that adding a task without a category fails
    await expect(() =>
      result.current.addTask("Thing", ""),
    ).rejects.toThrowError("Owner id for task is missing");

    // check that adding a task without text fails
    await expect(() =>
      result.current.addTask("", "user-1"),
    ).rejects.toThrowError("Task text is missing");

    // check that it never added a task
    expect(mockDependencies.tasksService.addTask).not.toHaveBeenCalled();

    // check that it did not refetch the tasks
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledOnce();

    // check that the list of tasks is still the same as before
    expect(result.current.tasks).toEqual(initialMockedTasks);
  });

  it("should provide tasks and counts filtered by category correctly", async () => {
    // arrange
    const fakeTasks: Task[] = [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ];

    const mockDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi.fn(async () => fakeTasks),
      },
    };

    const queryClient = createQueryClient();
    const { result } = renderHook(() =>
      useTasksModel(queryClient, mockDependencies),
    );
    let selectedOwnerId = "user-1";

    // check that the tasks load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the tasks were loaded
    expect(result.current.tasks).toEqual(fakeTasks);

    // create a reference to tasks filtered by category
    const {
      result: tasksBySelectedOwnerIdResult,
      rerender: rerenderTasksBySelectedOwnerId,
    } = renderHook(() => result.current.useTasksByOwnerId(selectedOwnerId));

    // create a reference to tasks count filtered by category
    const {
      result: tasksCountBySelectedOwnerIdResult,
      rerender: rerenderTasksCountBySelectedOwnerId,
    } = renderHook(() =>
      result.current.useTasksCountByOwnerId(selectedOwnerId),
    );

    // check that correct filtered tasks are provided
    expect(tasksBySelectedOwnerIdResult.current).toEqual([
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
    ]);

    // check that correct filtered tasks count is provided
    expect(tasksCountBySelectedOwnerIdResult.current).toEqual(2);

    // change the selected category
    selectedOwnerId = "user-2";
    rerenderTasksBySelectedOwnerId(selectedOwnerId);
    rerenderTasksCountBySelectedOwnerId(selectedOwnerId);

    // check that correct filtered tasks are provided
    expect(tasksBySelectedOwnerIdResult.current).toEqual([
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ]);

    // check that correct filtered tasks count is provided
    expect(tasksCountBySelectedOwnerIdResult.current).toEqual(2);
  });
});
