import { Dependencies, model } from "./model";
import { createStore } from "easy-peasy";

describe("addTodo (command)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockDependencies = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // act
    await store.getActions().addTodo("Paint house");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(1);
    expect(store.getState().todos).toEqual([
      { id: "abc", text: "Paint house" },
    ]);
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const mockDependencies = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // act
    await store.getActions().addTodo("Paint house");
    await store.getActions().addTodo("Buy milk");
    await store.getActions().addTodo("Wash car");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(3);
    expect(store.getState().todos).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
  });

  it("should fail validation when adding empty todo", async () => {
    // arrange
    const mockDependencies = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // act
    await store.getActions().addTodo("");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(0);
    expect(store.getState().todos).toEqual([]);
  });
});

describe("autoSaveTodosOnChange (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(async () => []),
      },
      waitTimeBeforeSave: 1000,
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // act
    await store.getActions().addTodo("Write docs");

    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave);

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(async () => []),
      },
      waitTimeBeforeSave: 100,
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // act
    await store.getActions().initializeTodos();
    await store.getActions().addTodo("Write docs");
    await store.getActions().addTodo("Write tests");
    await store.getActions().addTodo("Paint house");

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // act
    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave / 2);

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // act
    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave / 2);

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(1);

    // act
    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave);

    // assert
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(1);
  });
});
