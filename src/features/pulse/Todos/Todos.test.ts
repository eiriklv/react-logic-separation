import {
  arraySignal,
  HeadingElement,
  setContext,
  StringInput,
  text,
  TextElement,
} from "@cognite/pulse";
import {
  LOADING_INDICATOR_ID,
  TITLE_HEADING_ID,
  TODO_INPUT_ID,
  Todos,
} from "./Todos";
import { TodosModel } from "./model";
import { todosContext } from "./Todos.context";

describe("Todos Component", () => {
  it("Renders correctly before initialized", () => {
    // arrange
    const todosModelMock: Partial<TodosModel> = {
      addTodo: vi.fn(),
      initializeTodos: vi.fn(),
      isInitialized: () => false,
      isSaving: () => false,
      todos: arraySignal([]),
      todosCount: () => 0,
    };

    setContext(todosContext, {
      todosModel: todosModelMock as TodosModel,
      TodoItem: () => text("TodoItem"),
    });

    const container = Todos();

    // assert
    expect(
      container.getElementById(TextElement, LOADING_INDICATOR_ID).label()
    ).toEqual("Loading...");
  });

  it("Renders correctly after initialized", () => {
    // arrange
    const todosModelMock: Partial<TodosModel> = {
      addTodo: vi.fn(),
      initializeTodos: vi.fn(),
      isInitialized: () => true,
      isSaving: () => false,
      todos: arraySignal([]),
      todosCount: () => 0,
    };

    setContext(todosContext, {
      todosModel: todosModelMock as TodosModel,
      TodoItem: () => text("TodoItem"),
    });

    const container = Todos();

    // assert
    expect(
      container.getElementById(HeadingElement, TITLE_HEADING_ID).label()
    ).toEqual("Todos");
  });

  it("Calls the correct handler when adding a todo", async () => {
    // arrange
    const todosModelMock: Partial<TodosModel> = {
      addTodo: vi.fn(),
      initializeTodos: vi.fn(),
      isInitialized: () => true,
      isSaving: () => false,
      todos: arraySignal([]),
      todosCount: () => 0,
    };

    setContext(todosContext, {
      todosModel: todosModelMock as TodosModel,
      TodoItem: () => text("TodoItem"),
    });

    const container = Todos();

    // act
    container.getElementById(StringInput, TODO_INPUT_ID).value("Paint house");
    container.getElementById(StringInput, TODO_INPUT_ID).onValueChange("Paint house");
    container.getElementById(StringInput, TODO_INPUT_ID).onApply();

    // assert
    expect(todosModelMock.addTodo).toHaveBeenCalledWith("Paint house");
  });
});
