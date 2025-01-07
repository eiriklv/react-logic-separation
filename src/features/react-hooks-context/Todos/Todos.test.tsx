import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Todos } from "./Todos";
import { TodosContext, TodosContextInterface } from "./Todos.context";

describe("Todos Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TodosContextInterface = {
      useTodosModel: () => ({
        addTodo: async () => {},
        initializeTodos: async () => {},
        isInitialized: true,
        isSaving: false,
        todos: [],
        todosCount: 0,
      }),
      TodoItem: () => <></>,
    };

    render(
      <TodosContext.Provider value={dependencies}>
        <Todos />
      </TodosContext.Provider>
    );

    // assert
    expect(screen.getByText("Todos")).toBeInTheDocument();
  });

  it("Calls the correct handler when adding a todo", async () => {
    // arrange
    const addTodo = vi.fn();

    const dependencies: TodosContextInterface = {
      useTodosModel: () => ({
        addTodo,
        initializeTodos: async () => {},
        isInitialized: true,
        isSaving: false,
        todos: [],
        todosCount: 0,
      }),
      TodoItem: () => <></>,
    };

    render(
      <TodosContext.Provider value={dependencies}>
        <Todos />
      </TodosContext.Provider>
    );

    // act
    await userEvent.type(screen.getByLabelText("Todo"), "Paint house");
    await userEvent.type(screen.getByLabelText("Todo"), "{enter}");

    // assert
    expect(addTodo).toHaveBeenCalledWith("Paint house");
  });
});
