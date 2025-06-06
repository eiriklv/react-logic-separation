import {
  createDeleteTaskCommand,
  DeleteTaskCommandDependencies,
} from "./delete-task.command";

/**
 * Optional: This removes unnecessary collect-time for default dependencies
 */
vi.mock("./delete-task.command.dependencies", () => ({ default: {} }));

describe("DeleteTaskCommand", () => {
  it("should work as expected when deleting a task", async () => {
    // arrange
    const mockDependencies: DeleteTaskCommandDependencies = {
      tasksService: {
        deleteTask: vi.fn(async () => {}),
      },
    };

    const mockTaskId = "task-1";

    const deleteTaskCommand = createDeleteTaskCommand(mockDependencies);

    // delete the task
    await deleteTaskCommand(mockTaskId);

    // check that the underlying service was called
    expect(mockDependencies.tasksService?.deleteTask).toHaveBeenCalledWith(
      mockTaskId,
    );
  });
});
