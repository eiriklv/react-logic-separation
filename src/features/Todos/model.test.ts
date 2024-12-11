import { describe, it, expect, vi } from "vitest";
import { Injections, model } from "./model";
import { createStore } from "easy-peasy";
import { sleep } from "./utils";
import { trackActionsMiddleware } from "../../test/utils";

describe("addedTodo (action)", () => {
  it("should work as expected when adding a single todo", () => {
    // arrange
    const todoText = "Paint house";

    const mockInjections = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockInjections,
    });

    // act
    store.getActions().addTodo(todoText);

    // assert
    expect(mockInjections.generateId).toBeCalled();
    expect(store.getState().todos).toEqual([
      { id: "abc", text: "Paint house" },
    ]);
    expect(store.getState().todosCount).toEqual(1);
  });

  it("should work as expected when adding multiple todos", () => {
    // arrange
    const mockInjections = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockInjections,
    });

    // act
    store.getActions().addTodo("Paint house");
    store.getActions().addTodo("Buy milk");
    store.getActions().addTodo("Wash car");

    // assert
    expect(mockInjections.generateId).toBeCalledTimes(3);
    expect(store.getState().todos).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
    expect(store.getState().todosCount).toEqual(3);
  });
});

describe("addTodo (thunk)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const todoText = "Paint house";

    const mockInjections = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockInjections,
      mockActions: true,
    });

    // act
    await store.getActions().addTodo(todoText);

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(1);
    expect(store.getMockedActions()).toEqual([
      { type: "@thunk.addTodo(start)", payload: todoText },
      { type: "@action.addedTodo", payload: { id: "abc", text: todoText } },
      { type: "@thunk.addTodo(success)", payload: todoText },
    ]);
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const todoText = "Paint house";

    const mockInjections = {
      generateId: vi.fn(() => "abc"),
    };

    const store = createStore(model, {
      injections: mockInjections,
      mockActions: true,
    });

    // act
    await store.getActions().addTodo(todoText);
    await store.getActions().addTodo(todoText);
    await store.getActions().addTodo(todoText);

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(3);
    expect(store.getMockedActions()).toEqual([
      { type: "@thunk.addTodo(start)", payload: todoText },
      { type: "@action.addedTodo", payload: { id: "abc", text: todoText } },
      { type: "@thunk.addTodo(success)", payload: todoText },
      { type: "@thunk.addTodo(start)", payload: todoText },
      { type: "@action.addedTodo", payload: { id: "abc", text: todoText } },
      { type: "@thunk.addTodo(success)", payload: todoText },
      { type: "@thunk.addTodo(start)", payload: todoText },
      { type: "@action.addedTodo", payload: { id: "abc", text: todoText } },
      { type: "@thunk.addTodo(success)", payload: todoText },
    ]);
  });
});

describe("autoSaveTodosOnChange (effect)", () => {
  it("should not trigger if changes happen before list is initialized", async () => {
    // arrange
    const todoText = "Write docs";

    const mockInjections: Injections = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 1000,
    };

    const actionTracker = trackActionsMiddleware();

    const store = createStore(model, {
      middleware: [actionTracker],
      injections: mockInjections,
      initialState: {
        todos: [],
        isInitialized: false,
        isSaving: false,
      },
    });

    // act
    store.getActions().addedTodo({ id: "abc", text: todoText });

    await sleep(mockInjections.waitTimeBeforeSave);

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(0);
    expect(actionTracker.actions).toMatchObject([
      {
        type: "@action.addedTodo",
        payload: {
          id: "abc",
          text: "Write docs",
        },
      },
      {
        type: "@effectOn.autoSaveTodosOnChange(start)",
        change: {
          prev: [[], false],
          current: [
            [
              {
                id: "abc",
                text: "Write docs",
              },
            ],
            false,
          ],
          action: {
            type: "@action.addedTodo",
            payload: {
              id: "abc",
              text: "Write docs",
            },
          },
        },
      },
      {
        type: "@effectOn.autoSaveTodosOnChange(success)",
        change: {
          prev: [[], false],
          current: [
            [
              {
                id: "abc",
                text: "Write docs",
              },
            ],
            false,
          ],
          action: {
            type: "@action.addedTodo",
            payload: {
              id: "abc",
              text: "Write docs",
            },
          },
        },
      },
    ]);
  });

  it("should trigger if changes happen after list is initialized", async () => {
    // arrange
    const todoText = "Write docs";

    const mockInjections: Injections = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 1000,
    };

    const actionTracker = trackActionsMiddleware();

    const store = createStore(model, {
      middleware: [actionTracker],
      injections: mockInjections,
      initialState: {
        todos: [],
        isInitialized: true,
        isSaving: false,
      },
    });

    // act
    store.getActions().addedTodo({ id: "abc", text: todoText });

    // assert
    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(0);

    await sleep(mockInjections.waitTimeBeforeSave);

    expect(mockInjections.todosService.saveTodos).toHaveBeenCalledTimes(1);
    expect(actionTracker.actions).toMatchObject([
      {
        type: "@action.addedTodo",
        payload: {
          id: "abc",
          text: "Write docs",
        },
      },
      {
        type: "@effectOn.autoSaveTodosOnChange(start)",
        change: {
          prev: [[], true],
          current: [
            [
              {
                id: "abc",
                text: "Write docs",
              },
            ],
            true,
          ],
          action: {
            type: "@action.addedTodo",
            payload: {
              id: "abc",
              text: "Write docs",
            },
          },
        },
      },
      {
        type: "@effectOn.autoSaveTodosOnChange(success)",
        change: {
          prev: [[], true],
          current: [
            [
              {
                id: "abc",
                text: "Write docs",
              },
            ],
            true,
          ],
          action: {
            type: "@action.addedTodo",
            payload: {
              id: "abc",
              text: "Write docs",
            },
          },
        },
      },
      {
        type: "@action.toggledSaveState",
        payload: true,
      },
      {
        type: "@action.toggledSaveState",
        payload: false,
      },
    ]);
  });
});
