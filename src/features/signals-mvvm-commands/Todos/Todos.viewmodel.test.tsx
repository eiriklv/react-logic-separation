import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TodosViewModelContextInterface,
  TodosViewModelContext,
} from "./Todos.viewmodel.context";
import { useTodosViewModel } from "./Todos.viewmodel";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useTodosViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockDependencies: PartialDeep<TodosViewModelContextInterface> = {
      todosModel: {
        isInitialized: signal(true),
        isSaving: signal(true),
        todos: signal([]),
        todosCount: signal(0),
        addTodo: vi.fn(),
        initializeTodos: vi.fn(),
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
    expect(result.current.isInitialized).toEqual(
      mockDependencies.todosModel?.isInitialized?.value,
    );
    expect(result.current.isSaving).toEqual(
      mockDependencies.todosModel?.isSaving?.value,
    );
    expect(result.current.todos).toEqual(
      mockDependencies.todosModel?.todos?.value,
    );
    expect(result.current.todosCount).toEqual(
      mockDependencies.todosModel?.todosCount?.value,
    );
    expect(result.current.addTodo).toEqual(
      mockDependencies.todosModel?.addTodo,
    );
  });
});
