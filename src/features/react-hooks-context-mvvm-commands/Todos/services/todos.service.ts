import { sleep } from "../../../../lib/utils";
import { Todo } from "../types";

/**
 * Services are typically things like SDKs, APIs or other classes that
 * expose a bunch of methods to interact with some internal state,
 * which might reside on the client and/or the server through some network layer
 *
 * Services will often interact with an sdk or directly with an API, so that
 * testing a service will often involve either using a mock for the SDK,
 * or things like mock-service-worker or nock (mocking the network layer)
 */
export class TodosService {
  private _todos: Todo[] = [
    { id: "1", text: "Buy milk" },
    { id: "2", text: "Paint house" },
  ];

  public async fetchTodos() {
    await sleep(1000);
    return this._todos.slice();
  }

  public async saveTodos(todosToSave: Todo[]) {
    await sleep(1000);
    this._todos.splice(0, this._todos.length, ...todosToSave);
  }
}

export const todosServiceSingleton = new TodosService();
