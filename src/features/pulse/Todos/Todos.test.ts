import { arraySignal, signal, StringInput, TextElement } from "@cognite/pulse";
import { TITLE_HEADING_ID, TODO_INPUT_ID, Todos } from "./Todos";
import { TodosModel } from "./model";

describe("Todos Component", () => {
  it("Renders correctly", () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const todosModelMock: TodosModel = {
      addTodo: async () => {},
      initializeTodos: async () => {},
      isInitialized: signal(true),
      isSaving: signal(false),
      todos: arraySignal([]),
      todosCount: signal(0),
    };

    const container = Todos(todosModelMock);

    // assert
    expect(
      container.getDescendantById(TextElement, TITLE_HEADING_ID).label()
    ).toEqual("Todos");
  });

  it("Calls the correct handler when adding a todo", async () => {
    // arrange
    const addTodo = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const todosModelMock: TodosModel = {
      addTodo: async () => {},
      initializeTodos: async () => {},
      isInitialized: signal(true),
      isSaving: signal(false),
      todos: arraySignal([]),
      todosCount: signal(0),
    };

    const container = Todos(todosModelMock);

    // act
    container.getDescendantById(StringInput, TODO_INPUT_ID).value("Paint house");
    container.getDescendantById(StringInput, TODO_INPUT_ID).onApply();

    // assert
    expect(addTodo).toHaveBeenCalledWith("Paint house");
  });
});
