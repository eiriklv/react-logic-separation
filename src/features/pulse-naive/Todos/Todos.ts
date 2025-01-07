import {
  computed,
  effect,
  heading,
  signal,
  text,
  verticalFlex,
  container,
  BaseElement,
  arraySignal,
  stringInput,
  dynamic,
} from "@cognite/pulse";
import * as todosService from "./services/todos.service";
import { Todo } from "./types";
import { generateId } from "../../../lib/utils";
import { TodoItem } from "./components/TodoItem";

export const TITLE_HEADING_ID = "title-heading";
export const SAVING_STATUS_ID = "saving-status";
export const TODO_INPUT_ID = "todo-input";
export const TODOS_COUNT_ID = "todos-count";

const waitTimeBeforeSave = 1000;

export function Todos(): BaseElement {
  // State
  const todos = arraySignal<Todo>([]);
  const isSaving = signal<boolean>(false);
  const isInitialized = signal<boolean>(false);

  // Computed values
  const todosCount = computed<number>(() => todos().length);

  // Events
  const initializedTodos = (payload: Todo[]) => {
    todos(payload);
    isInitialized(true);
  };
  const addedTodo = (payload: Todo) => {
    todos([...todos(), payload]);
  };
  const toggledSaveState = (payload: boolean) => {
    isSaving(payload);
  };

  // Commands
  const initializeTodos = async () => {
    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    initializedTodos(todos);
  };
  const addTodo = async (payload: string) => {
    // Input validation
    if (!payload) {
      return;
    }

    // Generate new instance of todo
    const newTodo = {
      id: generateId(),
      text: payload,
    };

    // Trigger event
    addedTodo(newTodo);
  };

  // Effects
  effect(() => {
    // Get the changed values that triggered the effect
    const todosValue = todos().slice();
    const isInitializedValue = isInitialized();

    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitializedValue) {
      return;
    }

    // Set a timeout/debounce for running the save effect
    const saveTimeout = setTimeout(async () => {
      toggledSaveState(true);
      await todosService.saveTodos(todosValue);
      toggledSaveState(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      toggledSaveState(false);
    };
  });

  // Initialize the todos
  // (no need to wrap this in an effect because this function only runs once)
  initializeTodos();

  // Create local view state for form/input
  const todoInputText = signal("");

  // Create local view event handler for form
  const handleTodoInputTextChange = (newInputText: string) => {
    todoInputText(newInputText);
  };

  const handleTodoInputEnter = () => {
    addTodo(todoInputText());
    todoInputText("");
  };

  return dynamic().element(() => {
    if (!isInitialized()) {
      return text("Loading...");
    }

    const todoElements = todos().map((todo) => TodoItem({ todo }));

    return verticalFlex()
      .alignItems("center")
      .addChildren(
        text("pulse-naive"),
        heading(() => `Todos ${isSaving() ? "(saving...)" : ""}`, 3).id(
          TITLE_HEADING_ID
        ),
        heading(() => `Things to do: ${todosCount()}`, 4).id(
          TODOS_COUNT_ID
        ),
        stringInput()
          .id(TODO_INPUT_ID)
          .label("Todo")
          .value(() => todoInputText())
          .setOnValueChange(handleTodoInputTextChange)
          .setOnApply(handleTodoInputEnter),
        container().addChildren(...todoElements)
      );
  });
}