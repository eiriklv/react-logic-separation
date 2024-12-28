import { createStore } from "jotai";
import { Injections, TodosModel } from "./model";
import { noop, sleep } from "./utils";

describe("addedTodo (action)", () => {
  it("should work as expected when adding a single todo", () => {
    // arrange
    const model = new TodosModel();
    const store = createStore();

    // act
    store.set(model.addedTodo, { id: "abc", text: "Paint house" });

    // assert
    expect(store.get(model.todos)).toEqual([
      { id: "abc", text: "Paint house" },
    ]);
    expect(store.get(model.todosCount)).toEqual(1);
  });

  it("should work as expected when adding multiple todos", () => {
    // arrange
    const model = new TodosModel();
    const store = createStore();

    // act
    store.set(model.addedTodo, { id: "abc", text: "Paint house" });
    store.set(model.addedTodo, { id: "abc", text: "Buy milk" });
    store.set(model.addedTodo, { id: "abc", text: "Wash car" });

    // assert
    expect(store.get(model.todos)).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
    expect(store.get(model.todosCount)).toEqual(3);
  });
});

describe("addTodo (thunk)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockInjections: Injections = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        fetchTodos: vi.fn(),
        saveTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockInjections);
    const store = createStore();

    // act
    await store.set(model.addTodo, "Paint house");

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(1);
    expect(store.get(model.todos)).toEqual([
      { id: "abc", text: "Paint house" },
    ]);
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const mockInjections: Injections = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        fetchTodos: vi.fn(),
        saveTodos: vi.fn(),
      },
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockInjections);
    const store = createStore();

    // act
    await store.set(model.addTodo, "Paint house");
    await store.set(model.addTodo, "Buy milk");
    await store.set(model.addTodo, "Wash car");

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(3);
    expect(store.get(model.todos)).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
  });
});

describe("autoSaveTodosOnChange (effect)", () => {
  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const mockInjections: Injections = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 1000,
    };

    const model = new TodosModel(mockInjections);
    const store = createStore();

    // mount effects
    store.sub(model.autoSaveTodosOnChange, noop);

    // act
    store.set(model.addedTodo, { id: "abc", text: "Write docs" });

    await sleep(mockInjections.waitTimeBeforeSave);

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(0);
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // arrange
    const mockInjections: Injections = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(async () => []),
      },
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockInjections);
    const store = createStore();

    // mount effects
    store.sub(model.autoSaveTodosOnChange, noop);

    // act
    await store.set(model.initializeTodos);
    await store.set(model.addTodo, "Write docs");
    await store.set(model.addTodo, "Write tests");
    await store.set(model.addTodo, "Paint house");

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // act
    await sleep(mockInjections.waitTimeBeforeSave / 2);

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // act
    await sleep(mockInjections.waitTimeBeforeSave / 2);

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(1);

    // act
    await sleep(mockInjections.waitTimeBeforeSave);

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(1);
  });
});
