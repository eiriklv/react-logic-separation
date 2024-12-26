import { atom, createStore } from "jotai";
import { atomEffect } from "jotai-effect";

import * as todosService from "./services/todos.service";
import { generateId } from "./utils";

// Dependencies to be injected
const injections = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

// Types and interfaces
export type Injections = typeof injections;

export interface Todo {
  id: string;
  text: string;
}

// Dependencies
export const injectionsAtom = atom(injections);

// State
export const todosAtom = atom<Todo[]>([]);
export const isSavingAtom = atom<boolean>(false);
export const isInitializedAtom = atom<boolean>(false);

// Computed values
export const todosCountAtom = atom<number>((get) => get(todosAtom).length);

// Events
export const initializedTodosAtom = atom<null, [Todo[]], void>(
  null,
  (_get, set, payload) => {
    set(todosAtom, payload);
    set(isInitializedAtom, true);
  }
);

export const addedTodoAtom = atom<null, [Todo], void>(
  null,
  (_get, set, payload) => {
    set(todosAtom, (todos) => [...todos, payload]);
  }
);

export const toggledSaveStateAtom = atom<null, [boolean], void>(
  null,
  (_get, set, payload) => {
    set(isSavingAtom, payload);
  }
);

// Commands
export const initializeTodosAtom = atom<null, [], Promise<void>>(
  null,
  async (get, set) => {
    // Get dependencies
    const { todosService } = get(injectionsAtom);

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    set(initializedTodosAtom, todos);
  }
);

export const addTodoAtom = atom<null, [string], Promise<void>>(
  null,
  async (get, set, payload) => {
    // Get dependencies
    const { generateId } = get(injectionsAtom);

    // TODO: Do validation of input if applicable

    // Generate new instance of todo
    const newTodo = {
      id: generateId(),
      text: payload,
    };

    // Trigger event
    set(addedTodoAtom, newTodo);
  }
);

// Effects
export const autoSaveTodosOnChangeAtom = atomEffect((get, set) => {
  // Get dependencies
  const { todosService, waitTimeBeforeSave } = get(injectionsAtom);

  // Get the changed values that triggered the effect
  const todos = get(todosAtom);
  const isInitialized = get(isInitializedAtom);

  // Validation (only auto-save after the data has been initialized/loaded)
  if (!isInitialized) {
    return () => {};
  }

  // Set a timeout/debounce for running the save effect
  const saveTimeout = setTimeout(async () => {
    set(toggledSaveStateAtom, true);
    await todosService.saveTodos(todos);
    set(toggledSaveStateAtom, false);
  }, waitTimeBeforeSave);

  // Return handle for cancelling debounced save
  return () => {
    clearTimeout(saveTimeout);
    set(toggledSaveStateAtom, false);
  };
});

// Model store instance (with dependencies injected)
export const store = createStore();
