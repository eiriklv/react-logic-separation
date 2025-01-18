import {
  heading,
  signal,
  text,
  verticalFlex,
  container,
  stringInput,
  dynamic,
  ContainerElement,
  getContext,
} from "@cognite/pulse";
import { TodoItem } from "./components/TodoItem";
import { todosContext } from "./Todos.context";

export const TITLE_HEADING_ID = "title-heading";
export const SAVING_STATUS_ID = "saving-status";
export const TODO_INPUT_ID = "todo-input";
export const TODOS_COUNT_ID = "todos-count";

export function Todos(): ContainerElement {
  const { todosModel } = getContext(todosContext);

  const {
    addTodo,
    initializeTodos,
    isInitialized,
    isSaving,
    todos,
    todosCount,
  } = todosModel;

  // Initialize the todos
  // (no need to wrap this in an effect because this function only runs once)
  initializeTodos();

  // Create local view state for form/input
  const todoInputText = signal("");

  // Create local view event handler for form
  const handleTodoInputTextChange = (newInputText: string) => {
    todoInputText(newInputText);
  };

  // Create local view event handler for form
  const handleTodoInputEnter = () => {
    addTodo(todoInputText());
    todoInputText("");
  };

  return container().addChild(
    dynamic().element(() => {
      if (!isInitialized()) {
        return text("Loading...");
      }

      const todoElements = todos().map((todo) => TodoItem({ todo }));

      return verticalFlex()
        .alignItems("center")
        .addChildren(
          text("pulse"),
          heading(() => `Todos ${isSaving() ? "(saving...)" : ""}`, 3).id(
            TITLE_HEADING_ID
          ),
          heading(() => `Things to do: ${todosCount()}`, 4).id(TODOS_COUNT_ID),
          stringInput()
            .id(TODO_INPUT_ID)
            .label("Todo")
            .value(() => todoInputText())
            .setOnValueChange(handleTodoInputTextChange)
            .setOnApply(handleTodoInputEnter),
          container().addChildren(...todoElements)
        );
    })
  );
}
