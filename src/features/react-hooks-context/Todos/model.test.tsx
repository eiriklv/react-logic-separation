import { renderHook, act } from "@testing-library/react";
import { useTodosModel } from "./model";
import { TodosModelContext, TodosModelContextInterface } from "./model.context";
import React from "react";

describe("Add todos (command)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosModelContext.Provider value={mockDependencies}>
        {children}
      </TodosModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // act
    await act(() => result.current.addTodo("Paint house"));

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual([{ id: "abc", text: "Paint house" }]);
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosModelContext.Provider value={mockDependencies}>
        {children}
      </TodosModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // act
    await act(() => result.current.addTodo("Paint house"));
    await act(() => result.current.addTodo("Buy milk"));
    await act(() => result.current.addTodo("Wash car"));

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(3);
    expect(result.current.todos).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
  });

  it("should fail validation when adding empty todo", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosModelContext.Provider value={mockDependencies}>
        {children}
      </TodosModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // act
    await act(() => result.current.addTodo(""));

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(0);
    expect(result.current.todos).toEqual([]);
  });
});

describe("Todos auto-save (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosModelContext.Provider value={mockDependencies}>
        {children}
      </TodosModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // act
    await act(() => result.current.addTodo("Write docs"));

    await act(() =>
      vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave),
    );

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(async () => []),
      },
      waitTimeBeforeSave: 100,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosModelContext.Provider value={mockDependencies}>
        {children}
      </TodosModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // act
    await act(() => result.current.initializeTodos());

    await act(() => result.current.addTodo("Write docs"));
    await act(() => result.current.addTodo("Write tests"));
    await act(() => result.current.addTodo("Paint house"));

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // act
    await act(() =>
      vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave / 2),
    );

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // act
    await act(() =>
      vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave / 2),
    );

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(1);

    // act
    await act(() =>
      vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave),
    );

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(1);
  });
});
