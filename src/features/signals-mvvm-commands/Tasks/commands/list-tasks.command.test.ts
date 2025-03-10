import {
  ListTasksCommand,
  ListTasksCommandDependencies,
} from "./list-tasks.command";
import type { PartialDeep } from "type-fest";

describe("ListTasksCommand", () => {
  it("should work as expected when listing tasks", async () => {
    // arrange
    const mockDependencies: PartialDeep<ListTasksCommandDependencies> = {
      tasksService: {
        listTasks: vi.fn(async () => []),
      },
    };

    const listTasksCommand = new ListTasksCommand(
      mockDependencies as ListTasksCommandDependencies,
    );

    // fetch the tasks
    const tasks = await listTasksCommand.invoke();

    // check that the tasks were given as a result
    expect(tasks).toEqual([]);

    // check that the underlying service was called
    expect(mockDependencies.tasksService?.listTasks).toHaveBeenCalledOnce();
  });
});
