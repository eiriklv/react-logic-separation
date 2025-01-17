import { StringInput, TextElement } from "@cognite/pulse";
import { TITLE_HEADING_ID, TODO_INPUT_ID, Todos } from "./Todos";
import { TodosModel } from "./model";

describe("Todos Component", () => {
  it("Renders correctly", () => {
    // arrange
    const todosModelMock: TodosModel = {
      addTodo: vi.fn(),
      initializeTodos: vi.fn(),
      isInitialized: () => true,
      isSaving: () => false,
      todos: () => [],
      todosCount: () => 0,
    };

    const container = Todos(todosModelMock);

    // assert
    expect(
      container.getElementById(TextElement, TITLE_HEADING_ID).label()
    ).toEqual("Todos");
  });

  it("Calls the correct handler when adding a todo", async () => {
    // arrange
    const todosModelMock: TodosModel = {
      addTodo: vi.fn(),
      initializeTodos: vi.fn(),
      isInitialized: () => true,
      isSaving: () => false,
      todos: () => [],
      todosCount: () => 0,
    };

    const container = Todos(todosModelMock);

    // act
    container
      .getElementById(StringInput, TODO_INPUT_ID)
      .value("Paint house");
    container.getElementById(StringInput, TODO_INPUT_ID).onApply();

    // assert
    expect(todosModelMock.addTodo).toHaveBeenCalledWith("Paint house");
  });
});
