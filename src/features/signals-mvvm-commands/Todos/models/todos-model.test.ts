import { TodosDependencies, TodosModel } from "./todos-model";

describe("Add todos (command)", () => {
  it("should work as expected when adding a single todo", async () => {
    // arrange
    const mockDependencies: TodosDependencies = {
      fetchTodosCommand: vi.fn(),
      saveTodosCommand: vi.fn(),
      generateId: vi.fn(() => "abc"),
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockDependencies);

    // add a todo
    await model.addTodo("Paint house");

    // check that todos now contain newly added todo
    expect(model.todos.value).toEqual([{ id: "abc", text: "Paint house" }]);
  });

  it("should work as expected when adding multiple todos", async () => {
    // arrange
    const mockDependencies: TodosDependencies = {
      fetchTodosCommand: vi.fn(),
      saveTodosCommand: vi.fn(),
      generateId: vi.fn(() => "abc"),
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockDependencies);

    // add multiple todos
    await model.addTodo("Paint house");
    await model.addTodo("Buy milk");
    await model.addTodo("Wash car");

    // check that todos now contain all the newly added todos
    expect(model.todos.value).toEqual([
      { id: "abc", text: "Paint house" },
      { id: "abc", text: "Buy milk" },
      { id: "abc", text: "Wash car" },
    ]);
  });

  it("should fail validation when adding empty todo", async () => {
    // arrange
    const mockDependencies: TodosDependencies = {
      fetchTodosCommand: vi.fn(),
      saveTodosCommand: vi.fn(),
      generateId: vi.fn(() => "abc"),
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockDependencies);

    // add an empty todo
    await model.addTodo("");

    // check that the empty todo was not added to the list
    expect(model.todos.value).toEqual([]);
  });
});

describe("Todos auto-save (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not trigger save if changes happen before list is initialized", async () => {
    // arrange
    const mockDependencies: TodosDependencies = {
      fetchTodosCommand: vi.fn(),
      saveTodosCommand: vi.fn(),
      generateId: vi.fn(() => "abc"),
      waitTimeBeforeSave: 100,
    };

    const model = new TodosModel(mockDependencies);

    // add a todo
    await model.addTodo("Write docs");

    // run out the timer of the debounced save
    vi.runAllTimers();

    // check that no saving has been initiated
    expect(model.isSaving.value).toEqual(false);

    // check that no saving has been performed
    expect(mockDependencies.saveTodosCommand).not.toHaveBeenCalled();
  });

  it("should only trigger save after specified wait/debounce time", async () => {
    // mock up the dependencies for the model
    const mockDependencies: TodosDependencies = {
      fetchTodosCommand: vi.fn(async () => []),
      saveTodosCommand: vi.fn(async () => {}),
      generateId: vi.fn(() => "abc"),
      waitTimeBeforeSave: 100,
    };

    // create an instance of the model
    const model = new TodosModel(mockDependencies);

    // initialize the list of todos
    await model.initializeTodos();

    // check that init was performed
    expect(model.isInitialized.value).toEqual(true);

    // add some todos to the list
    await model.addTodo("Write docs");
    await model.addTodo("Write tests");
    await model.addTodo("Paint house");

    // check that no saving has been performed (yet)
    expect(mockDependencies.saveTodosCommand).not.toHaveBeenCalled();

    // check that we are not currently saving
    expect(model.isSaving.value).toEqual(false);

    // run out the timer of the debounced save
    vi.runAllTimers();

    // check that saving has been initiated
    expect(model.isSaving.value).toEqual(true);

    // wait for the saving function to be called
    await vi.waitFor(() =>
      expect(mockDependencies.saveTodosCommand).toHaveBeenCalled(),
    );

    // check that we are no longer saving
    expect(model.isSaving.value).toEqual(false);

    // run any pending timers
    vi.runAllTimers();

    // check that the saving was not performed multiple times
    expect(mockDependencies.saveTodosCommand).toHaveBeenCalledTimes(1);
  });
});
