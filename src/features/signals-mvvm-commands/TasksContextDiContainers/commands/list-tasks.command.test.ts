import {
  createListTasksCommand,
  ListTasksCommandDependencies,
} from "./list-tasks.command";

describe("ListTasksCommand", () => {
  it("should work as expected when listing tasks", async () => {
    // arrange
    const mockDependencies: ListTasksCommandDependencies = {
      tasksService: {
        listTasks: vi.fn(async () => []),
      },
    };

    const listTasksCommand = createListTasksCommand(mockDependencies);

    // fetch the tasks
    const tasks = await listTasksCommand();

    // check that the tasks were given as a result
    expect(tasks).toEqual([]);

    // check that the underlying service was called
    expect(mockDependencies.tasksService?.listTasks).toHaveBeenCalledOnce();
  });
});
