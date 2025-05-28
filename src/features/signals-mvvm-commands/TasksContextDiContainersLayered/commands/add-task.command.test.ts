import {
  AddTaskCommandDependencies,
  createAddTaskCommand,
} from "./add-task.command";

/**
 * Optional: This removes unnecessary collect-time for default dependencies
 */
vi.mock("./add-task.command.dependencies", () => ({ default: {} }));

describe("AddTaskCommand", () => {
  it("should work as expected when adding a task", async () => {
    // arrange
    const mockDependencies: AddTaskCommandDependencies = {
      tasksService: {
        addTask: vi.fn(),
      },
    };

    const addTaskCommand = createAddTaskCommand(mockDependencies);

    // add a task
    await addTaskCommand("Paint house", "user-1");

    // check that the underlying service was called
    expect(mockDependencies.tasksService?.addTask).toHaveBeenCalledWith(
      "Paint house",
      "user-1",
    );

    // check that error is thrown if text is missing
    expect(() => addTaskCommand("", "")).toThrowError("Task text is missing");

    // check that error is thrown if category is missing
    expect(() => addTaskCommand("Do something", "")).toThrowError(
      "Owner id for task is missing",
    );
  });
});
