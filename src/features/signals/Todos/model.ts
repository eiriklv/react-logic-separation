import { signal, computed, effect, batch } from "@preact/signals-core";

import * as todosService from "./services/todos.service";
import { generateId } from "../../../lib/utils";

// Dependencies to be injected
const defaultDependencies = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

// Types and interfaces
export type Dependencies = typeof defaultDependencies;

export interface Todo {
  id: string;
  text: string;
}

export class TodosModel {
  constructor(dependencies: Dependencies = defaultDependencies) {
    this.injections = dependencies;
  }

  // Dependencies
  injections: Dependencies = defaultDependencies;

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

  // Effects
  disposeAutoSaveTodosOnChange = effect(() => {
    // Get dependencies
    const { todosService, waitTimeBeforeSave } = this.injections;

    // Get the changed values that triggered the effect
    const todos = this.todos.value;
    const isInitialized = this.isInitialized.value;

    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitialized) {
      return;
    }

    // Set a timeout/debounce for running the save effect
    const saveTimeout = setTimeout(async () => {
      this.toggledSaveState(true);
      await todosService.saveTodos(todos);
      this.toggledSaveState(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      this.toggledSaveState(false);
    };
  });

  // Commands
  initializeTodos = async () => {
    // Get dependencies
    const { todosService } = this.injections;

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    this.initializedTodos(todos);
  };
  addTodo = async (payload: string) => {
    // Get dependencies
    const { generateId } = this.injections;

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
    this.addedTodo(newTodo);
  };

  dispose() {
    this.disposeAutoSaveTodosOnChange();
  }
}

// Model singleton
export const model = new TodosModel();
