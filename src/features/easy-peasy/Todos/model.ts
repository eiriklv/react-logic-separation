import {
  createStore,
  action,
  Action,
  effectOn,
  EffectOn,
  thunk,
  Thunk,
  computed,
  Computed,
} from "easy-peasy";

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

// Model interface
export interface TodosModel {
  // State
  todos: Todo[];
  isSaving: boolean;
  isInitialized: boolean;

  // Computed values
  todosCount: Computed<TodosModel, number>;

  // Events
  initializedTodos: Action<TodosModel, Todo[]>;
  addedTodo: Action<TodosModel, Todo>;
  toggledSaveState: Action<TodosModel, boolean>;

  // Commands
  initializeTodos: Thunk<TodosModel, undefined, Injections>;
  addTodo: Thunk<TodosModel, string, Injections>;

  // Effects
  autoSaveTodosOnChange: EffectOn<TodosModel, TodosModel, Injections>;
}

export interface Todo {
  id: string;
  text: string;
}

// Model implementation
export const model: TodosModel = {
  // State
  todos: [],
  isSaving: false,
  isInitialized: false,

  // Computed values
  todosCount: computed((state) => state.todos.length),

  // Events
  initializedTodos: action((state, payload) => {
    state.todos = payload;
    state.isInitialized = true;
  }),
  addedTodo: action((state, payload) => {
    state.todos.push(payload);
  }),
  toggledSaveState: action((state, payload) => {
    state.isSaving = payload;
  }),

  // Commands
  initializeTodos: thunk(async (actions, _payload, { injections }) => {
    // Get dependencies
    const { todosService } = injections;

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    actions.initializedTodos(todos);
  }),
  addTodo: thunk(async (actions, payload, { injections }) => {
    // Get dependencies
    const { generateId } = injections;

    // TODO: Do validation of input if applicable

    // Generate new instance of todo
    const newTodo = {
      id: generateId(),
      text: payload,
    };

    // Trigger event
    actions.addedTodo(newTodo);
  }),

  // Effects
  autoSaveTodosOnChange: effectOn(
    [(state) => state.todos, (state) => state.isInitialized],
    (actions, change, { injections }) => {
      // Get dependencies
      const { todosService, waitTimeBeforeSave } = injections;

      // Get the changed values that triggered the effect
      const [todos, isInitialized] = change.current;

      // Validation (only auto-save after the data has been initialized/loaded)
      if (!isInitialized) {
        return () => {};
      }

      // Set a timeout/debounce for running the save effect
      const saveTimeout = setTimeout(async () => {
        actions.toggledSaveState(true);
        await todosService.saveTodos(todos);
        actions.toggledSaveState(false);
      }, waitTimeBeforeSave);

      // Return handle for cancelling debounced save
      return () => {
        clearTimeout(saveTimeout);
        actions.toggledSaveState(false);
      };
    }
  ),
};

// Model store instance (with dependencies injected)
export const store = createStore(model, { injections });
