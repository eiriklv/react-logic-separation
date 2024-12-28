import { atom, createStore, getDefaultStore } from "jotai";
import { atomEffect } from "jotai-effect";

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
    this.injections = dependencies;
  }

  // Dependencies
  injections: Injections = defaultDependencies;

  // State
  todos = atom<Todo[]>([]);
  isSaving = atom<boolean>(false);
  isInitialized = atom<boolean>(false);

  // Computed values
  todosCount = atom<number>((get) => get(this.todos).length);

  // Events
  initializedTodos = atom<null, [Todo[]], void>(null, (_get, set, payload) => {
    set(this.todos, payload);
    set(this.isInitialized, true);
  });

  addedTodo = atom<null, [Todo], void>(null, (_get, set, payload) => {
    set(this.todos, (todos) => [...todos, payload]);
  });

  toggledSaveState = atom<null, [boolean], void>(null, (_get, set, payload) => {
    set(this.isSaving, payload);
  });

  // Commands
  initializeTodos = atom<null, [], Promise<void>>(null, async (_get, set) => {
    // Get dependencies
    const { todosService } = this.injections;

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    set(this.initializedTodos, todos);
  });

  addTodo = atom<null, [string], Promise<void>>(
    null,
    async (_get, set, payload) => {
      // Get dependencies
      const { generateId } = this.injections;

      // TODO: Do validation of input if applicable

      // Generate new instance of todo
      const newTodo = {
        id: generateId(),
        text: payload,
      };

      // Trigger event
      set(this.addedTodo, newTodo);
    }
  );

  // Effects
  autoSaveTodosOnChange = atomEffect((get, set) => {
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
      set(this.toggledSaveState, true);
      await todosService.saveTodos(todos);
      set(this.toggledSaveState, false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      set(this.toggledSaveState, false);
    };
  });
}

// Model instance
export const model = new TodosModel();

// Store instance
export const store = getDefaultStore();
