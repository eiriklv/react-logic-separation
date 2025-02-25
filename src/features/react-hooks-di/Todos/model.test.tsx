import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useTodosModel,
  TodosModelContext,
  TodosModelContextInterface,
} from "./model";
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
    await waitFor(() => result.current.addTodo("Paint house"));

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledOnce();
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
    await waitFor(() => result.current.addTodo("Paint house"));
    await waitFor(() => result.current.addTodo("Buy milk"));
    await waitFor(() => result.current.addTodo("Wash car"));

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
    await waitFor(() => result.current.addTodo(""));

    // assert
    expect(mockDependencies.generateId).not.toHaveBeenCalled();
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
      waitTimeBeforeSave: 1000,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TodosModelContext.Provider value={mockDependencies}>
        {children}
      </TodosModelContext.Provider>
    );

    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // add a todo
    await act(() => result.current.addTodo("Write docs"));

    // run out the timer of the debounced save
    act(() => vi.runAllTimers());

    // check that no saving has been initiated
    expect(result.current.isSaving).toEqual(false);

    // check that no saving has been performed
    expect(mockDependencies.todosService.saveTodos).not.toHaveBeenCalled();
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // mock up the dependencies for the model
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

    // create an instance of the model
    const { result } = renderHook(() => useTodosModel(), { wrapper });

    // initialize the list of todos
    await act(() => result.current.initializeTodos());

    // check that init was performed
    expect(result.current.isInitialized).toEqual(true);

    // add some todos to the list
    await act(() => result.current.addTodo("Write docs"));
    await act(() => result.current.addTodo("Write tests"));
    await act(() => result.current.addTodo("Paint house"));

    // check that no saving has been performed (yet)
    expect(mockDependencies.todosService.saveTodos).not.toHaveBeenCalled();

    // check that we are not currently saving
    expect(result.current.isSaving).toEqual(false);

    // run out the timer of the debounced save
    act(() => vi.runAllTimers());

    // check that saving has been initiated
    expect(result.current.isSaving).toEqual(true);

    // wait for the saving function to be called
    await act(() =>
      vi.waitFor(() =>
        expect(mockDependencies.todosService.saveTodos).toHaveBeenCalled(),
      ),
    );

    // check that we are no longer saving
    expect(result.current.isSaving).toEqual(false);

    // run any pending timers
    act(() => vi.runAllTimers());

    // check that the saving was not performed multiple times
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledOnce();
  });
});
