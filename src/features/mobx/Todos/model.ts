import { autorun, reaction, makeAutoObservable } from "mobx";
import * as todosService from "./services/todos.service";
import { generateId } from "../../../lib/utils";

// Dependencies to be injected
const defaultDependencies = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

// Types and interfaces
export type TodosDependencies = typeof defaultDependencies;

export interface Todo {
  id: string;
  text: string;
}

export class TodosModel {
  constructor(dependencies: TodosDependencies = defaultDependencies) {
    // Mobx magic...
    makeAutoObservable(this);

    // Dependencies
    this._injections = dependencies;

    // Effects
    this._disposeAutoSaveTodosOnChange = autorun(() => {
      // Get dependencies
      const { todosService, waitTimeBeforeSave } = this._injections;

      // Get the changed values that triggered the effect
      const todos = this._todos;
      const isInitialized = this._isInitialized;

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
      reaction(
        () => ({
          todos: this._todos,
          isInitialized: this._isInitialized,
        }),
        () => {
          clearTimeout(saveTimeout);
          this._toggledSaveState(false);
        },
      );
    });
  }

  // Dependencies
  private _injections: TodosDependencies = defaultDependencies;

  // State
  private _todos: Todo[] = [];
  private _isSaving: boolean = false;
  private _isInitialized: boolean = false;

  // Computed values
  private get _todosCount(): number {
    return this._todos.length;
  }

  // Events
  private _initializedTodos = (payload: Todo[]) => {
    this._todos = payload;
    this._isInitialized = true;
  };

  private _addedTodo = (payload: Todo) => {
    this._todos = [...this._todos, payload];
  };

  private _toggledSaveState = (payload: boolean) => {
    this._isSaving = payload;
  };

  // Effects
  private _disposeAutoSaveTodosOnChange: () => void;

  // Getters
  public get todos(): Todo[] {
    return this._todos;
  }

  public get isSaving(): boolean {
    return this._isSaving;
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public get todosCount(): number {
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

  public dispose() {
    this._disposeAutoSaveTodosOnChange();
  }
}

// Model singleton
export const model = new TodosModel();
