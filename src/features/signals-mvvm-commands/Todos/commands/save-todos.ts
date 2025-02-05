import { todosServiceSingleton } from "../services/todos.service";
import { Todo } from "../types";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Command handle things like validation, transformation, error mapping, etc
 * - so that the consumer can use it with a much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  todosService: todosServiceSingleton,
};

export type SaveTodosCommandDependencies = typeof defaultDependencies;

export class SaveTodosCommand {
  private _dependencies: SaveTodosCommandDependencies;

  constructor(
    dependencies: SaveTodosCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }

  public invoke(todos: Todo[]) {
    return this._dependencies.todosService.saveTodos(todos);
  }
}

export const saveTodosCommand = new SaveTodosCommand().invoke;
