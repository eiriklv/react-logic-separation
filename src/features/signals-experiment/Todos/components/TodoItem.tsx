import { Todo } from "../model"

type Props = {
  todo: Todo
}

export function TodoItem({ todo }: Props) {
  return <li>{todo.text}</li>
}