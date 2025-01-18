import { BaseElement, container, divider, text } from "@cognite/pulse";
import { Todo } from "../types";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props): BaseElement {
  return container().addChildren(
    text(todo.text).id(todo.id),
    divider(),
  );
}
