import { signal, computed, batch } from "@preact/signals-core";

import * as todosService from "./services/todos.service";
import { relay } from "../../../lib/signals";
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
  isInitialized = signal<boolean>(false);

  // Computed values
  todosCount = computed<number>(() => this.todos.value.length);

  // Relays (based on: https://www.pzuraq.com/blog/on-signal-relays)
  isSaving = relay(false, (set) => {
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
      set(true);
      await todosService.saveTodos(todos);
      set(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      set(false);
    };
  })

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
}

// Model instance
export const model = new TodosModel();
