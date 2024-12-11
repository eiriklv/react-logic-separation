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

import debounce from 'debounce'

import * as todosService from "./services";
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
  initializeTodos: Thunk<TodosModel, undefined, Injections>
  addTodo: Thunk<TodosModel, string, Injections>;
  
  // Effects
  autoSaveTodosOnChange: EffectOn<TodosModel, TodosModel, Injections>;
}

// Model implementation
export const model: TodosModel = {
  todos: [],
  isSaving: false,
  isInitialized: false,
  initializedTodos: action((state, payload) => {
    state.todos = payload;
    state.isInitialized = true;
  }),
  initializeTodos: thunk(async (actions, _payload, { injections }) => {
    // Get dependencies
    const { todosService } = injections;

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    actions.initializedTodos(todos);
  }),
  todosCount: computed((state) => state.todos.length),
  addedTodo: action((state, payload) => {
    state.todos.push(payload);
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
  toggledSaveState: action((state, payload) => {
    state.isSaving = payload;
  }),
  autoSaveTodosOnChange: effectOn(
    [(state) => state.todos, (state) => state.isInitialized],
    (actions, change, { injections }) => {
      // Get dependencies
      const { todosService, waitTimeBeforeSave } = injections;

      // Get the changed values that triggered the effect
      const [todos, isInitialized] = change.current;

      // Validation (only auto-save after the data has been initialized/loaded)
      if (!isInitialized) {
        return () => {}
      }

      // Create a function for updating the save state + run the service effect
      const saveTodos = async (todos: Todo[]) => {
        actions.toggledSaveState(true);
        await todosService.saveTodos(todos);
        actions.toggledSaveState(false);
      }

      // Create debounced version of the save function
      const debouncedSaveTodos = debounce(saveTodos, waitTimeBeforeSave);

      // Start the debounce countdown
      debouncedSaveTodos(todos);

      // Return handle for cancelling debounced save
      return () => {
        debouncedSaveTodos.clear()
        actions.toggledSaveState(false);
      };
    }
  ),
};

// Model store instance (with dependencies injected)
export const store = createStore(model, { injections });
