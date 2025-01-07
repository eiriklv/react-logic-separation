import { useCallback, useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { useTodosModel } from "./model";

export function Todos() {
  // Use the todos model (state and commands)
  const {
    isInitialized,
    isSaving,
    todos,
    todosCount,
    addTodo,
    initializeTodos,
  } = useTodosModel();

  // Since a hook cannot be consumed outside of React we have
  // perform any initialization inside the component tree itself
  useEffect(() => {
    initializeTodos();
  }, [initializeTodos]);

  // Create local view state for form/input
  const [todoInputText, setTodoInputText] = useState("");

  // Create local view event handler for form
  const handleTodoInputTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoInputText(event.target.value);
    },
    []
  );

  // Create local view event handler for form
  const handleTodoInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        addTodo(todoInputText);
        setTodoInputText("");
      }
    },
    [addTodo, todoInputText]
  );

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  const todoElements = todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo}></TodoItem>
  ));

  return (
    <div>
      <pre>react-hooks</pre>
      <h3>
        Todos <span>{isSaving && "(saving...)"}</span>
      </h3>
      <h4>Things to do: {todosCount}</h4>
      <label>
        Todo
        <input
          name="todo"
          type="text"
          value={todoInputText}
          onChange={handleTodoInputTextChange}
          onKeyDown={handleTodoInputKeyDown}
        />
      </label>
      <ul>{todoElements}</ul>
    </div>
  );
}
