import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TodosViewModelContextInterface,
  TodosViewModelContext,
} from "./Todos.view-model.context";
import { useTodosViewModel } from "./Todos.view-model";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useTodosViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addTodo = vi.fn();
    const initializeTodos = vi.fn();

    const mockDependencies: PartialDeep<TodosViewModelContextInterface> = {
      todosModel: {
        isInitialized: signal(true),
        isSaving: signal(true),
        todos: signal([]),
        todosCount: signal(0),
        addTodo,
        initializeTodos,
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosViewModelContext.Provider
        value={mockDependencies as TodosViewModelContextInterface}
      >
        {children}
      </TodosViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosViewModel(), { wrapper });

    // assert
    expect(result.current).toEqual({
      isInitialized: true,
      isSaving: true,
      todos: [],
      todosCount: 0,
      addTodo,
    });
  });
});
