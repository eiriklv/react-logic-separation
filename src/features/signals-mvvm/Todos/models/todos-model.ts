import {
  signal,
  computed,
  effect,
  batch,
  ReadonlySignal,
} from "@preact/signals-core";

import * as todosService from "../services/todos.service";
import { generateId } from "../../../../lib/utils";
import { Todo } from "../types";

// Dependencies to be injected
const defaultDependencies = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

// Types and interfaces
export type TodosDependencies = typeof defaultDependencies;

export class TodosModel {
  // Dependencies
  private _injections: TodosDependencies = defaultDependencies;

  // State
  private _todos = signal<Todo[]>([]);
  private _isSaving = signal<boolean>(false);
  private _isInitialized = signal<boolean>(false);

  // Computed values
  private _todosCount = computed<number>(() => this._todos.value.length);

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
  private _toggledSaveState = (payload: boolean) => {
    this._isSaving.value = payload;
  };

  // Effects
  private _disposeAutoSaveTodosOnChange: () => void;

  // Constructor
  constructor(dependencies: TodosDependencies = defaultDependencies) {
    this._injections = dependencies;

    // Effects
    this._disposeAutoSaveTodosOnChange = effect(() => {
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
  }

  // Getters (read-only signals)
  public get todos(): ReadonlySignal<Todo[]> {
    return this._todos;
  }

  public get isSaving(): ReadonlySignal<boolean> {
    return this._isSaving;
  }

  public get isInitialized(): ReadonlySignal<boolean> {
    return this._isInitialized;
  }

  public get todosCount(): ReadonlySignal<number> {
    return this._todosCount;
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
export const todosModel = new TodosModel();
