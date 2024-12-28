import { signal, computed, effect, batch } from "@preact/signals-core";

import * as todosService from "./services/todos.service";
import { generateId } from "./utils";

// Dependencies to be injected
const defaultDependencies = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

// Types and interfaces
export type Injections = typeof defaultDependencies;

export interface Todo {
  id: string;
  text: string;
}

export class TodosModel {
  constructor(dependencies: Injections = defaultDependencies) {
    this.injections.value = dependencies;
  }

  // Dependencies
  injections = signal<Injections>(defaultDependencies);

  // State
  todos = signal<Todo[]>([]);
  isSaving = signal<boolean>(false);
  isInitialized = signal<boolean>(false);

  // Computed values
  todosCount = computed<number>(() => this.todos.value.length);

  // Events
  initializedTodos = (payload: Todo[]) => {
    batch(() => {
      this.todos.value = payload;
      this.isInitialized.value = true;
    });
  };
  addedTodo = (payload: Todo) => {
    this.todos.value = [...this.todos.value, payload];
  };
  toggledSaveState = (payload: boolean) => {
    this.isSaving.value = payload;
  };

  // Commands
  initializeTodos = async () => {
    // Get dependencies
    const { todosService } = this.injections.value;

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    this.initializedTodos(todos);
  };
  addTodo = async (payload: string) => {
    // Get dependencies
    const { generateId } = this.injections.value;

    // TODO: Do validation of input if applicable

    // Generate new instance of todo
    const newTodo = {
      id: generateId(),
      text: payload,
    };

    // Trigger event
    this.addedTodo(newTodo);
  };

  // Effects
  autoSaveTodosOnChange = effect(() => {
    // Get dependencies
    const { todosService, waitTimeBeforeSave } = this.injections.value;

    // Get the changed values that triggered the effect
    const todosValue = this.todos.value;
    const isInitializedValue = this.isInitialized.value;

    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitializedValue) {
      return () => {};
    }

    // Set a timeout/debounce for running the save effect
    const saveTimeout = setTimeout(async () => {
      this.toggledSaveState(true);
      await todosService.saveTodos(todosValue);
      this.toggledSaveState(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      this.toggledSaveState(false);
    };
  });
}

export function createStore({ injections }: { injections?: Injections } = {}) {
  return new TodosModel(injections);
}

export const store = createStore();
