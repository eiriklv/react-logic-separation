import { TodosDependencies, model } from "./model";
import { createStore } from "easy-peasy";

describe("Add todos (command)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockDependencies = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // add a todo
    await store.getActions().addTodo("Paint house");

    // check that todos now contain newly added todo
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

    // add multiple todos
    await store.getActions().addTodo("Paint house");
    await store.getActions().addTodo("Buy milk");
    await store.getActions().addTodo("Wash car");

    // check that todos now contain all the newly added todos
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

    // add an empty todo
    await store.getActions().addTodo("");

    // check that the empty todo was not added to the list
    expect(store.getState().todos).toEqual([]);
  });
});

describe("Todos auto-save (effect)", () => {
  beforeEach(() => {
    // use fake timers so that we don't have to wait for test to finish
    vi.useFakeTimers();
  });

  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: TodosDependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(async () => []),
      },
      waitTimeBeforeSave: 10000000,
    };

    const store = createStore(model, {
      injections: mockDependencies,
    });

    // add a todo
    await store.getActions().addTodo("Write docs");

    // wait for timers to run
    vi.runAllTimers();

    // check that no saving was performed
    expect(mockDependencies.todosService.saveTodos).not.toHaveBeenCalled();
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // arrange
    const mockDependencies: TodosDependencies = {
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

    // initialize the list of todos
    await store.getActions().initializeTodos();

    // check that init was performed
    expect(store.getState().isInitialized).toEqual(true);

    await store.getActions().addTodo("Write docs");
    await store.getActions().addTodo("Write tests");
    await store.getActions().addTodo("Paint house");

    // check that no saving has been performed (yet)
    expect(mockDependencies.todosService.saveTodos).not.toHaveBeenCalled();

    // check that we are not currently saving
    expect(store.getState().isSaving).toEqual(false);

    // run out the timer of the debounced save
    vi.runAllTimers();

    // check that saving has been initiated
    expect(store.getState().isSaving).toEqual(true);

    // wait for the saving function to be called
    await vi.waitFor(() =>
      expect(mockDependencies.todosService.saveTodos).toHaveBeenCalled(),
    );

    // check that we are no longer saving
    expect(store.getState().isSaving).toEqual(false);

    // run any pending timers
    vi.runAllTimers();

    // check that the saving was not performed multiple times
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledOnce();
  });
});
