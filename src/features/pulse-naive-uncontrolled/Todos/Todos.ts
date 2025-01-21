import {
  computed,
  effect,
  heading,
  signal,
  text,
  container,
  BaseElement,
  arraySignal,
  stringInput,
  toCollection,
  list,
} from "@cognite/pulse";
import * as todosService from "./services/todos.service";
import { Todo } from "./types";
import { generateId } from "../../../lib/utils";
import { TodoItem } from "./components/TodoItem";

export const LOADING_INDICATOR_ID = "loading-indicator";
export const TITLE_HEADING_ID = "title-heading";
export const SAVING_STATUS_ID = "saving-status";
export const TODO_INPUT_ID = "todo-input";
export const TODOS_COUNT_ID = "todos-count";

const waitTimeBeforeSave = 1000;

export function Todos(): BaseElement {
  // Inputs (both state and ui)
  const todoTextInput = stringInput()
    .id(TODO_INPUT_ID)
    .label("Todo")
    .setOnApply((input) => {
      addTodo(input.value());
      input.value("");
    });

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
        todoTextInput,
        todoListElement,
      )
      .isVisible(() => isInitialized()),
  );
}
