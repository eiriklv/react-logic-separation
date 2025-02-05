import {
  FetchTodosCommand,
  FetchTodosCommandDependencies,
} from "./fetch-todos";
import type { PartialDeep } from "type-fest";

describe("FetchTodosCommand", () => {
  it("should work as expected when adding a todo", async () => {
    // arrange
    const mockDependencies: PartialDeep<FetchTodosCommandDependencies> = {
      todosService: {
        fetchTodos: vi.fn(async () => []),
      },
    };

    const fetchTodosCommand = new FetchTodosCommand(
      mockDependencies as FetchTodosCommandDependencies,
    );

    // fetch the todos
    const todos = await fetchTodosCommand.invoke();

    // check that the todos were given as a result
    expect(todos).toEqual([]);

    // check that the underlying service was called
    expect(mockDependencies.todosService?.fetchTodos).toHaveBeenCalledOnce();
  });
});
