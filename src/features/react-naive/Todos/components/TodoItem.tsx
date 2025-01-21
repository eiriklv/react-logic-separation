import { Todo } from "../types";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props) {
  return <li>{todo.text}</li>;
}
