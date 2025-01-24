import { sleep } from "../../../../lib/utils";
import { Todo } from "../model";

const todos: Todo[] = [
  { id: "1", text: "Buy milk" },
  { id: "2", text: "Paint house" },
];

export async function fetchTodos() {
  await sleep(1000);
  return todos.slice();
}

export async function saveTodos(todosToSave: Todo[]) {
  await sleep(1000);
  todos.splice(0, todos.length, ...todosToSave);
}
