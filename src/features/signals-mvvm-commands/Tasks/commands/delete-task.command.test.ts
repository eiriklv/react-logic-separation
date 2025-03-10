import {
  DeleteTaskCommand,
  DeleteTaskCommandDependencies,
} from "./delete-task.command";
import type { PartialDeep } from "type-fest";

describe("DeleteTaskCommand", () => {
  it("should work as expected when deleting a task", async () => {
    // arrange
    const mockDependencies: PartialDeep<DeleteTaskCommandDependencies> = {
      tasksService: {
        deleteTask: vi.fn(async () => {}),
      },
    };

    const mockTaskId = "task-1";

    const fetchRemindersCommand = new DeleteTaskCommand(
      mockDependencies as DeleteTaskCommandDependencies,
    );

    // delete the task
    await fetchRemindersCommand.invoke(mockTaskId);

    // check that the underlying service was called
    expect(mockDependencies.tasksService?.deleteTask).toHaveBeenCalledWith(
      mockTaskId,
    );
  });
});
