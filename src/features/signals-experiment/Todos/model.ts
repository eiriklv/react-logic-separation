import { signal, computed, batch, ReadonlySignal } from "@preact/signals-core";

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
    this._injections = dependencies;
  }

  // Dependencies
  private _injections: Dependencies = defaultDependencies;

  // State
  private _todos = signal<Todo[]>([]);
  private _isInitialized = signal<boolean>(false);

  // Computed
  private _todosCount = computed(() => this._todos.value.length);

  // Relays (based on: https://www.pzuraq.com/blog/on-signal-relays)
  private _isSaving = relay(false, (set) => {
    // Get dependencies
    const { todosService, waitTimeBeforeSave } = this._injections;

    // Get the changed values that triggered the effect
    const todos = this._todos.value;
    const isInitialized = this._isInitialized.value;

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
  });

  // Events
  private _initializedTodos = (payload: Todo[]) => {
    batch(() => {
      this._todos.value = payload;
      this._isInitialized.value = true;
    });
  };
  private _addedTodo = (payload: Todo) => {
    this._todos.value = [...this._todos.value, payload];
  };

  // Read-only signals (public for consumption)
  public get todos(): ReadonlySignal<Todo[]> {
    return this._todos;
  }
  public get isInitialized(): ReadonlySignal<boolean> {
    return this._isInitialized;
  }
  public get isSaving(): ReadonlySignal<boolean> {
    return this._isSaving;
  }
  public get todosCount(): ReadonlySignal<number> {
    return this._todosCount;
  }

  // Commands (public for consumption)
  public initializeTodos = async () => {
    // Get dependencies
    const { todosService } = this._injections;

    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    this._initializedTodos(todos);
  };
  public addTodo = async (payload: string) => {
    // Get dependencies
    const { generateId } = this._injections;

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
    this._addedTodo(newTodo);
  };
}

// Model singleton
export const model = new TodosModel();
