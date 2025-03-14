import { signal } from "@preact/signals-core";
import { Task } from "../types";
import { TasksModelDependencies, TasksModel } from "./tasks.model";
import { QueryClient } from "@tanstack/query-core";

describe("TasksModel", () => {
  it("should work as expected when adding a single task", async () => {
    // arrange
    let count = 0;
    const fakeTaskMocks: Task[][] = [
      [],
      [{ id: "1", text: "Solve some hard bug", ownerId: "user-1" }],
    ];

    const mockDependencies: TasksModelDependencies = {
      addTaskCommand: vi.fn(),
      deleteTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(async () => fakeTaskMocks[count++]),
    };

    const queryClient = new QueryClient();
    const model = new TasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual([]);

    // add some tasks
    await model.addTask("Solve some hard bug", "user-1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.addTaskCommand).toHaveBeenCalledOnce();

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.listTasksCommand).toHaveBeenCalledTimes(2);

    // check that the list of tasks is correct
    expect(model.tasks.value).toEqual(fakeTaskMocks[1]);
  });

  it("should work as expected when adding multiple tasks", async () => {
    // arrange
    let count = 0;
    const fakeTaskMocks: Task[][] = [
      [],
      [{ id: "1", text: "Fake 1", ownerId: "user-1" }],
      [
        { id: "1", text: "Fake 1", ownerId: "user-1" },
        { id: "2", text: "Fake 2", ownerId: "user-2" },
      ],
      [
        { id: "1", text: "Fake 1", ownerId: "user-1" },
        { id: "2", text: "Fake 2", ownerId: "user-2" },
        { id: "3", text: "Fake 3", ownerId: "user-3" },
      ],
    ];

    const mockDependencies: TasksModelDependencies = {
      addTaskCommand: vi.fn(async (reminder) => reminder),
      deleteTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(async () => fakeTaskMocks[count++]),
    };

    const queryClient = new QueryClient();
    const model = new TasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual([]);

    // add some tasks
    await model.addTask("Paint house", "user-1");
    await model.addTask("Buy milk", "user-1");
    await model.addTask("Wash car", "user-1");

    // check that the tasks were added the correct amount of times
    expect(mockDependencies.addTaskCommand).toHaveBeenCalledTimes(3);

    // check that the tasks were re-fetched the correct amount of times
    expect(mockDependencies.listTasksCommand).toHaveBeenCalledTimes(4);

    // check that the list of tasks is correct
    expect(model.tasks.value).toEqual(fakeTaskMocks[3]);
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    let count = 0;
    const fakeTaskMocks: Task[][] = [
      [],
      [{ id: "1", text: "Fake 1", ownerId: "user-1" }],
    ];

    // arrange
    const mockDependencies: TasksModelDependencies = {
      addTaskCommand: vi.fn(),
      deleteTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(async () => fakeTaskMocks[count++]),
    };

    const queryClient = new QueryClient();
    const model = new TasksModel(queryClient, mockDependencies);

    // check that the tasks load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the tasks were loaded
    expect(model.tasks.value).toEqual([]);

    // add a reminder without a category
    await model.addTask("Thing", "");

    // add a reminder without text
    await model.addTask("", "user-1");

    // check that it never added a reminder
    expect(mockDependencies.addTaskCommand).not.toHaveBeenCalled();

    // check that it did not refetch the tasks
    expect(mockDependencies.listTasksCommand).toHaveBeenCalledOnce();

    // check that the list of tasks is still the same as before
    expect(model.tasks.value).toEqual(fakeTaskMocks[0]);
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
      addTaskCommand: vi.fn(),
      deleteTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(async () => fakeTasks),
    };

    const queryClient = new QueryClient();
    const model = new TasksModel(queryClient, mockDependencies);
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
