import { BaseElement, text } from "@cognite/pulse";
import { Todo } from "../types";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props): BaseElement {
  return text(todo.text).id(todo.id);
}
