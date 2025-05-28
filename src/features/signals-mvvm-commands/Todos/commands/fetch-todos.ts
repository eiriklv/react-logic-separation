import { todosServiceSingleton } from "../services/todos.service";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Commands handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  todosService: todosServiceSingleton,
};

export type FetchTodosCommandDependencies = typeof defaultDependencies;

export class FetchTodosCommand {
  private _dependencies: FetchTodosCommandDependencies;

  public invoke = () => {
    return this._dependencies.todosService.fetchTodos();
  };

  constructor(
    dependencies: FetchTodosCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }
}

export const fetchTodosCommand = new FetchTodosCommand().invoke;
