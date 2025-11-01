import { signal } from "@preact/signals-core";
import { Task } from "../types";
import { TasksModelDependencies, createTasksModel } from "./tasks.model";
import { createQueryClient } from "../utils/create-query-client";

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
    const model = createTasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual(initialMockedTasks);
    expect(model.tasksCount.value).toEqual(0);

    // add some tasks
    await model.addTask("Solve some hard bug", "user-1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.addTask).toHaveBeenCalledOnce();

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(2);

    // check that the list of tasks is correct
    expect(model.tasks.value).toEqual(mockedTasksAfterAdd);
    expect(model.tasksCount.value).toEqual(1);
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
    const model = createTasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual(initialMockedTasks);

    // add some tasks
    await model.addTask("Paint house", "user-1");
    await model.addTask("Buy milk", "user-1");
    await model.addTask("Wash car", "user-1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.addTask).toHaveBeenCalledTimes(3);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(4);

    // check that the list of tasks is correct
    expect(model.tasks.value).toEqual(mockedTasksAfterThirdAdd);
    expect(model.tasksCount.value).toEqual(3);
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
    const model = createTasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual(initialMockedTasks);
    expect(model.tasksCount.value).toEqual(1);

    // add some tasks
    await model.deleteTask("1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.deleteTask).toHaveBeenCalledTimes(1);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(2);

    // check that the list of tasks is correct
    expect(model.tasks.value).toEqual(mockedTasksAfterDelete);
    expect(model.tasksCount.value).toEqual(0);
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
    const model = createTasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual(initialMockedTasks);
    expect(model.tasksCount.value).toEqual(1);

    // add some tasks
    expect(() => model.deleteTask("")).rejects.toThrowError(
      "Task id must be provided",
    );

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.tasksService.deleteTask).toHaveBeenCalledTimes(0);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledTimes(1);

    // check that the list of tasks is correct
    expect(model.tasks.value).toEqual(initialMockedTasks);
    expect(model.tasksCount.value).toEqual(1);
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
    const model = createTasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual(initialMockedTasks);

    // check that adding a task without a category fails
    expect(() => model.addTask("Thing", "")).rejects.toThrowError(
      "Owner id for task is missing",
    );

    // check that adding a task without text fails
    expect(() => model.addTask("", "user-1")).rejects.toThrowError(
      "Task text is missing",
    );

    // check that it never added a task
    expect(mockDependencies.tasksService.addTask).not.toHaveBeenCalled();

    // check that it did not refetch the tasks
    expect(mockDependencies.tasksService.listTasks).toHaveBeenCalledOnce();

    // check that the list of tasks is still the same as before
    expect(model.tasks.value).toEqual(initialMockedTasks);
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
    const model = createTasksModel(queryClient, mockDependencies);
    const selectedOwnerId = signal("user-1");

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual(fakeTasks);

    // create a reference to tasks filtered by category
    const tasksBySelectedOwnerId = model.getTasksByOwnerId(selectedOwnerId);

    // create a reference to tasks count filtered by category
    const tasksCountBySelectedOwnerId =
      model.getTasksCountByOwnerId(selectedOwnerId);

    // check that correct filtered tasks are provided
    expect(tasksBySelectedOwnerId.value).toEqual([
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
    ]);

    // check that correct filtered tasks count is provided
    expect(tasksCountBySelectedOwnerId.value).toEqual(2);

    // change the selected category
    selectedOwnerId.value = "user-2";

    // check that correct filtered tasks are provided
    expect(tasksBySelectedOwnerId.value).toEqual([
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ]);

    // check that correct filtered tasks count is provided
    expect(tasksCountBySelectedOwnerId.value).toEqual(2);
  });
});
