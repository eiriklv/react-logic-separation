import { createStore } from "jotai";
import { Dependencies, TodosModel } from "./model";

describe("Add todos (command)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        fetchTodos: vi.fn(),
        saveTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const store = createStore();
    const model = new TodosModel(mockDependencies, store);

    // act
    await model.addTodo("Paint house");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(1);
    expect(store.get(model.todos)).toEqual([
      { id: "abc", text: "Paint house" },
    ]);
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        fetchTodos: vi.fn(),
        saveTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const store = createStore();
    const model = new TodosModel(mockDependencies, store);

    // act
    await model.addTodo("Paint house");
    await model.addTodo("Buy milk");
    await model.addTodo("Wash car");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(3);
    expect(store.get(model.todos)).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
  });

  it("should fail validation when adding empty todo", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        fetchTodos: vi.fn(),
        saveTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const store = createStore();
    const model = new TodosModel(mockDependencies, store);

    // act
    await model.addTodo("");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(0);
    expect(store.get(model.todos)).toEqual([]);
  });
});

describe("Todos auto-save (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 1000,
    };

    const store = createStore();
    const model = new TodosModel(mockDependencies, store);

    // act
    await model.addTodo("Write docs");

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

    const store = createStore();
    const model = new TodosModel(mockDependencies, store);

    // act
    await model.initializeTodos();

    await model.addTodo("Write docs");
    await model.addTodo("Write tests");
    await model.addTodo("Paint house");

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
