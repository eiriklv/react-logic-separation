import {
  heading,
  signal,
  text,
  container,
  stringInput,
  ContainerElement,
  getContext,
  toCollection,
  list,
} from "@cognite/pulse";
import { todosContext } from "./Todos.context";

export const LOADING_INDICATOR_ID = "loading-indicator";
export const TITLE_HEADING_ID = "title-heading";
export const SAVING_STATUS_ID = "saving-status";
export const TODO_INPUT_ID = "todo-input";
export const TODOS_COUNT_ID = "todos-count";

export function Todos(): ContainerElement {
  const { todosModel, TodoItem } = getContext(todosContext);

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

  // Make a ui collection from the todos
  const todoListItems = toCollection(todos, (todo) => TodoItem({ todo }));

  // Add the collection to list
  const todoListElement = list().addChildren(todoListItems);

  return container().addChildren(
    container()
      .addChild(text("Loading...").id(LOADING_INDICATOR_ID))
      .isVisible(() => !isInitialized()),
    container()
      .addChildren(
        text("pulse"),
        heading(() => `Todos${isSaving() ? " (saving...)" : ""}`, 3).id(
          TITLE_HEADING_ID,
        ),
        heading(() => `Things to do: ${todosCount()}`, 4).id(TODOS_COUNT_ID),
        stringInput()
          .id(TODO_INPUT_ID)
          .label("Todo")
          .value(() => todoInputText())
          .setOnValueChange(handleTodoInputTextChange)
          .setOnApply(handleTodoInputEnter),
        todoListElement,
      )
      .isVisible(() => isInitialized()),
  );
}
