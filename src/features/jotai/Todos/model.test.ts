import { createStore } from "jotai";
import {
  addedTodoAtom,
  addTodoAtom,
  autoSaveTodosOnChangeAtom,
  initializeTodosAtom,
  Injections,
  injectionsAtom,
  todosAtom,
  todosCountAtom,
} from "./model";
import { noop, sleep } from "./utils";

describe("addedTodo (action)", () => {
  it("should work as expected when adding a single todo", () => {
    // arrange
    const store = createStore();

    // act
    store.set(addedTodoAtom, { id: "abc", text: "Paint house" });

    // assert
    expect(store.get(todosAtom)).toEqual([{ id: "abc", text: "Paint house" }]);
    expect(store.get(todosCountAtom)).toEqual(1);
  });

  it("should work as expected when adding multiple todos", () => {
    // arrange
    const store = createStore();

    // act
    store.set(addedTodoAtom, { id: "abc", text: "Paint house" });
    store.set(addedTodoAtom, { id: "abc", text: "Buy milk" });
    store.set(addedTodoAtom, { id: "abc", text: "Wash car" });

    // assert
    expect(store.get(todosAtom)).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
    expect(store.get(todosCountAtom)).toEqual(3);
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

    const store = createStore();

    // inject dependencies
    store.set(injectionsAtom, mockInjections);

    // act
    await store.set(addTodoAtom, "Paint house");

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(1);
    expect(store.get(todosAtom)).toEqual([{ id: "abc", text: "Paint house" }]);
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

    const store = createStore();

    // inject dependencies
    store.set(injectionsAtom, mockInjections);

    // act
    await store.set(addTodoAtom, "Paint house");
    await store.set(addTodoAtom, "Buy milk");
    await store.set(addTodoAtom, "Wash car");

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(3);
    expect(store.get(todosAtom)).toEqual([
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

    const store = createStore();

    // inject dependencies
    store.set(injectionsAtom, mockInjections);

    // mount effects
    store.sub(autoSaveTodosOnChangeAtom, noop);

    // act
    store.set(addedTodoAtom, { id: "abc", text: "Write docs" });

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

    const store = createStore();

    // inject dependencies
    store.set(injectionsAtom, mockInjections);

    // mount effects
    store.sub(autoSaveTodosOnChangeAtom, noop);

    // act
    await store.set(initializeTodosAtom);
    await store.set(addTodoAtom, "Write docs");
    await store.set(addTodoAtom, "Write tests");
    await store.set(addTodoAtom, "Paint house");

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
