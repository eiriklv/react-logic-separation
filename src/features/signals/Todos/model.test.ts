import { Injections, TodosModel } from "./model";
import { sleep } from "./utils";

describe("addedTodo (action)", () => {
  it("should work as expected when adding a single todo", () => {
    // arrange
    const model = new TodosModel();

    // act
    model.addedTodo({ id: "abc", text: "Paint house" });

    // assert
    expect(model.todos.value).toEqual([{ id: "abc", text: "Paint house" }]);
    expect(model.todosCount.value).toEqual(1);
  });

  it("should work as expected when adding multiple todos", () => {
    // arrange
    const model = new TodosModel();

    // act
    model.addedTodo({ id: "abc", text: "Paint house" });
    model.addedTodo({ id: "abc", text: "Buy milk" });
    model.addedTodo({ id: "abc", text: "Wash car" });

    // assert
    expect(model.todos.value).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
    expect(model.todosCount.value).toEqual(3);
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

    // act
    await model.addTodo("Paint house");

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(1);
    expect(model.todos.value).toEqual([{ id: "abc", text: "Paint house" }]);
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

    // act
    await model.addTodo("Paint house");
    await model.addTodo("Buy milk");
    await model.addTodo("Wash car");

    // assert
    expect(mockInjections.generateId).toHaveBeenCalledTimes(3);
    expect(model.todos.value).toEqual([
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

    // act
    await model.addTodo("Write docs");

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

    // act
    await model.initializeTodos();
    await model.addTodo("Write docs");
    await model.addTodo("Write tests");
    await model.addTodo("Paint house");

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
