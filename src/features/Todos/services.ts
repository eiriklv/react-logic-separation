import { Todo } from "./model";
import { sleep } from "./utils";

const todos: Todo[] = [
  { id: '1', text: 'Buy milk' },
  { id: '2', text: 'Paint house' },
];

export async function fetchTodos() {
  await sleep(1000);
  return todos;
}

export async function saveTodos(todosToSave: Todo[]) {
  await sleep(1000);
  todos.splice(0, todos.length, ...todosToSave);
}