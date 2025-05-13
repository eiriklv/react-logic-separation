import { useCallback, useContext, useState } from "react";
import { TodosContext } from "./Todos.context";

export function Todos() {
  // Get injected dependencies from context
  const {
    useTodos,
    useTodosCount,
    useAddTodo,
    useIsSaving,
    useIsInitialized,
    TodoItem,
  } = useContext(TodosContext);

  // Use injected dependencies (domain state/actions, components, etc)
  const isInitialized = useIsInitialized();
  const isSaving = useIsSaving();
  const todos = useTodos();
  const todosCount = useTodosCount();
  const addTodo = useAddTodo();

  // Local view state for form/input
  const [todoInputText, setTodoInputText] = useState("");

  // Create local view event handler for form
  const handleTodoInputTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoInputText(event.target.value);
    },
    [],
  );

  // Create local view event handler for form
  const handleTodoInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        addTodo(todoInputText);
        setTodoInputText("");
      }
    },
    [addTodo, todoInputText],
  );

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  const todoElements = todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo}></TodoItem>
  ));

  return (
    <div>
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
