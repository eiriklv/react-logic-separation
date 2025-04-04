import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodosModel } from "./todos-model";
import {
  TodosModelContext,
  TodosModelContextInterface,
} from "./todos-model.context";
import React from "react";

describe("Add todos (command)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      saveTodosCommand: vi.fn(async () => {}),
      fetchTodosCommand: vi.fn(async () => []),
      generateId: vi.fn(() => "abc"),
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

    await waitFor(() =>
      expect(result.current.todos).toEqual([
        { id: "abc", text: "Paint house" },
      ]),
    );
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      saveTodosCommand: vi.fn(async () => {}),
      fetchTodosCommand: vi.fn(async () => []),
      generateId: vi.fn(() => "abc"),
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

    await waitFor(() =>
      expect(result.current.todos).toEqual([
        { id: "abc", text: "Paint house" },
        { id: "abc", text: "Buy milk" },
        { id: "abc", text: "Wash car" },
      ]),
    );
  });

  it("should fail validation when adding empty todo", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      saveTodosCommand: vi.fn(async () => {}),
      fetchTodosCommand: vi.fn(async () => []),
      generateId: vi.fn(() => "abc"),
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

    await waitFor(() => expect(result.current.todos).toEqual([]));
  });
});

describe("Todos auto-save (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: TodosModelContextInterface = {
      saveTodosCommand: vi.fn(async () => {}),
      fetchTodosCommand: vi.fn(async () => []),
      generateId: vi.fn(() => "abc"),
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

    // add a todo
    await act(() => result.current.addTodo("Write docs"));

    // run out the timer of the debounced save
    act(() => vi.runAllTimers());

    // check that no saving has been initiated
    expect(result.current.isSaving).toEqual(false);

    // check that no saving has been performed
    expect(mockDependencies.saveTodosCommand).not.toHaveBeenCalled();
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // mock up the dependencies for the model
    const mockDependencies: TodosModelContextInterface = {
      saveTodosCommand: vi.fn(async () => {}),
      fetchTodosCommand: vi.fn(async () => []),
      generateId: vi.fn(() => "abc"),
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
    expect(mockDependencies.saveTodosCommand).not.toHaveBeenCalled();

    // check that we are not currently saving
    expect(result.current.isSaving).toEqual(false);

    // run out the timer of the debounced save
    act(() => vi.runAllTimers());

    // check that saving has been initiated
    expect(result.current.isSaving).toEqual(true);

    // wait for the saving function to be called
    await act(() =>
      vi.waitFor(() =>
        expect(mockDependencies.saveTodosCommand).toHaveBeenCalled(),
      ),
    );

    // check that we are no longer saving
    expect(result.current.isSaving).toEqual(false);

    // run any pending timers
    act(() => vi.runAllTimers());

    // check that the saving was not performed multiple times
    expect(mockDependencies.saveTodosCommand).toHaveBeenCalledOnce();
  });
});
