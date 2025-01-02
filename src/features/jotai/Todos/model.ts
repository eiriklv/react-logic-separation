import { atom, getDefaultStore } from "jotai";
import { atomEffect } from "jotai-effect";

import * as todosService from "./services/todos.service";
import { generateId, noop } from "./utils";

// Dependencies to be injected
const defaultDependencies = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

// Jotai store instance
const defaultStore = getDefaultStore();

// Types and interfaces
export type Dependencies = typeof defaultDependencies;

export interface Todo {
  id: string;
  text: string;
}

export class TodosModel {
  constructor(
    dependencies: Dependencies = defaultDependencies,
    store = defaultStore
  ) {
    // deal with injected dependencies
    this.injections = dependencies;
    this.store = store;

    // attach effects (since jotai does not do this automatically...)
    this.store.sub(this.autoSaveTodosOnChange, noop);
  }

  // Dependencies
  injections: Dependencies = defaultDependencies;

  // Store
  store: typeof defaultStore = defaultStore;

  // State
  todos = atom<Todo[]>([]);
  isSaving = atom<boolean>(false);
  isInitialized = atom<boolean>(false);

  // Computed values
  todosCount = atom<number>((get) => get(this.todos).length);

  // Events
  initializedTodos = (payload: Todo[]) => {
    this.store.set(this.todos, payload);
    this.store.set(this.isInitialized, true);
  };

  addedTodo = (payload: Todo) => {
    this.store.set(this.todos, (todos) => [...todos, payload]);
  };

  toggledSaveState = (payload: boolean) => {
    this.store.set(this.isSaving, payload);
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
  autoSaveTodosOnChange = atomEffect((get) => {
    // Get dependencies
    const { todosService, waitTimeBeforeSave } = this.injections;

    // Get the changed values that triggered the effect
    const todos = get(this.todos);
    const isInitialized = get(this.isInitialized);

    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitialized) {
      return () => {};
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
}

// Model instance
export const model = new TodosModel();