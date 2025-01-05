import { Dependencies, TodosModel } from "./model";

describe("addedTodo (event)", () => {
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

describe("addTodo (command)", () => {
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

    const model = new TodosModel(mockDependencies);

    // act
    await model.addTodo("Paint house");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(1);
    expect(model.todos.value).toEqual([{ id: "abc", text: "Paint house" }]);
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

    const model = new TodosModel(mockDependencies);

    // act
    await model.addTodo("Paint house");
    await model.addTodo("Buy milk");
    await model.addTodo("Wash car");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(3);
    expect(model.todos.value).toEqual([
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

    const model = new TodosModel(mockDependencies);

    // act
    await model.addTodo("");

    // assert
    expect(mockDependencies.generateId).toHaveBeenCalledTimes(0);
    expect(model.todos.value).toEqual([]);
  });
});

describe("isSaving (relay)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not trigger save if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(),
      },
      waitTimeBeforeSave: 1000,
    };

    const model = new TodosModel(mockDependencies);

    // act
    await model.addTodo("Write docs");

    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave);

    // assert
    expect(model.isSaving.value).toEqual(false);
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // mock up the dependencies for the model
    const mockDependencies: Dependencies = {
      generateId: vi.fn(() => "abc"),
      todosService: {
        saveTodos: vi.fn(),
        fetchTodos: vi.fn(async () => []),
      },
      waitTimeBeforeSave: 100,
    };

    // create an instance of the model
    const model = new TodosModel(mockDependencies);

    // initialize the list of todos
    await model.initializeTodos();

    // add some todos to the list
    await model.addTodo("Write docs");
    await model.addTodo("Write tests");
    await model.addTodo("Paint house");

    // saving should not happen immediately
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // wait to right before the debounce time runs out
    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave - 1);

    // it should not save before the debounce period
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(0);

    // proceed to the tick where the debounce time has run out
    vi.advanceTimersToNextTimer();

    // check that the save state is correct when the save has been initiated
    await vi.waitFor(() => expect(model.isSaving.value).toEqual(true));

    // check that the save function has been called
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(1);

    // check that the save state is reverted back after saving is done
    await vi.waitFor(() => expect(model.isSaving.value).toEqual(false));

    // wait some more
    await vi.advanceTimersByTimeAsync(mockDependencies.waitTimeBeforeSave);

    // check that the saving is not performed multiple times
    expect(mockDependencies.todosService.saveTodos).toHaveBeenCalledTimes(1);
  });
});
