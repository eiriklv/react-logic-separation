import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TodosViewModelContextInterface,
  TodosViewModelContext,
} from "./Todos.viewmodel.context";
import { useTodosViewModel } from "./Todos.viewmodel";

describe("useTodosViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const todosModelReturnValue: ReturnType<
      TodosViewModelContextInterface["useTodosModel"]
    > = {
      isInitialized: true,
      isSaving: true,
      todos: [],
      todosCount: 0,
      addTodo: vi.fn(),
      initializeTodos: vi.fn(),
    };

    const mockDependencies: TodosViewModelContextInterface = {
      useTodosModel: vi.fn(() => todosModelReturnValue),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosViewModelContext.Provider value={mockDependencies}>
        {children}
      </TodosViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosViewModel(), { wrapper });

    // assert
    expect(result.current.isInitialized).toEqual(
      todosModelReturnValue.isInitialized,
    );
    expect(result.current.isSaving).toEqual(todosModelReturnValue.isSaving);
    expect(result.current.todos).toEqual(todosModelReturnValue.todos);
    expect(result.current.todosCount).toEqual(todosModelReturnValue.todosCount);
    expect(result.current.addTodo).toEqual(todosModelReturnValue.addTodo);
    expect(result.current.initializeTodos).toEqual(
      todosModelReturnValue.initializeTodos,
    );
  });
});
