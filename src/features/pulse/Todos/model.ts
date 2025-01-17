import { signal, computed, effect, arraySignal } from "@cognite/pulse";

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
    this._injections = dependencies;
  }

  // Dependencies
  private _injections: Dependencies = defaultDependencies;

  // State
  private _todos = arraySignal<Todo>([]);
  private _isSaving = signal<boolean>(false);
  private _isInitialized = signal<boolean>(false);

  // Computed values
  private _todosCount = computed<number>(() => this._todos().length);

  // Events
  private _initializedTodos = (payload: Todo[]) => {
    this._todos(payload);
    this._isInitialized(true);
  };
  private _addedTodo = (payload: Todo) => {
    this._todos.push(payload);
  };
  private _toggledSaveState = (payload: boolean) => {
    this._isSaving(payload);
  };

  // Effects
  private _disposeAutoSaveTodosOnChange = effect(() => {
    // Get dependencies
    const { todosService, waitTimeBeforeSave } = this._injections;

    // Get the changed values that triggered the effect
    const todos = this._todos().slice();
    const isInitialized = this._isInitialized();

    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitialized) {
      return;
    }

    // Set a timeout/debounce for running the save effect
    const saveTimeout = setTimeout(async () => {
      this._toggledSaveState(true);
      await todosService.saveTodos(todos);
      this._toggledSaveState(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      this._toggledSaveState(false);
    };
  });

  // Readonly signals (public for consumption)
  public get todos() {
    return computed(() => this._todos());
  }
  public get isSaving() {
    return computed(() => this._isSaving());
  }
  public get isInitialized() {
    return computed(() => this._isInitialized());
  }
  public get todosCount() {
    return computed(() => this._todosCount());
  }

  // Commands
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

  // Disposal
  public dispose() {
    this._disposeAutoSaveTodosOnChange();
  }
}

// Model singleton
export const model = new TodosModel();
