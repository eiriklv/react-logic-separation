import { Todo } from "../types";
import { SaveTodosCommand, SaveTodosCommandDependencies } from "./save-todos";
import type { PartialDeep } from "type-fest";

describe("AddTodoCommand", () => {
  it("should work as expected when adding a todo", async () => {
    // arrange
    const mockDependencies: PartialDeep<SaveTodosCommandDependencies> = {
      todosService: {
        saveTodos: vi.fn(),
      },
    };

    const saveTodosCommand = new SaveTodosCommand(
      mockDependencies as SaveTodosCommandDependencies,
    );

    const todos: Todo[] = [
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ];

    // add a todo
    await saveTodosCommand.invoke(todos);

    // check that the underlying service was called
    expect(mockDependencies.todosService?.saveTodos).toHaveBeenCalledWith(
      todos,
    );
  });
});
