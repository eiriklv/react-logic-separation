import { AddTaskCommand, AddTaskCommandDependencies } from "./add-task.command";
import type { PartialDeep } from "type-fest";

describe("AddTaskCommand", () => {
  it("should work as expected when adding a task", async () => {
    // arrange
    const mockDependencies: PartialDeep<AddTaskCommandDependencies> = {
      tasksService: {
        addTask: vi.fn(),
      },
    };

    const addTaskCommand = new AddTaskCommand(
      mockDependencies as AddTaskCommandDependencies,
    );

    // add a reminder
    await addTaskCommand.invoke("Paint house", "user-1");

    // check that the underlying service was called
    expect(mockDependencies.tasksService?.addTask).toHaveBeenCalledWith(
      "Paint house",
      "user-1",
    );

    // check that error is thrown if text is missing
    expect(() => addTaskCommand.invoke("", "")).toThrowError(
      "Task text is missing",
    );

    // check that error is thrown if category is missing
    expect(() => addTaskCommand.invoke("Do something", "")).toThrowError(
      "Owner id for task is missing",
    );
  });
});
