import { useCallback, useEffect, useMemo, useState } from "react";
import * as todosService from "./services/todos.service";
import { TodoItem } from "./components/TodoItem";
import { generateId } from "../../../lib/utils";
import { Todo } from "./types";

const waitTimeBeforeSave = 1000;

export function Todos() {
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  // Computed
  const todosCount = useMemo(() => todos.length, [todos]);

  // Events
  const initializedTodos = (payload: Todo[]) => {
    setTodos(payload);
    setIsInitialized(true);
  };
  const addedTodo = (payload: Todo) => {
    setTodos((todos) => [...todos, payload]);
  };
  const toggledSaveState = (payload: boolean) => {
    setIsSaving(payload);
  };

  // Commands
  const initializeTodos = useCallback(async () => {
    // Run side effect
    const todos = await todosService.fetchTodos();

    // Trigger event
    initializedTodos(todos);
  }, []);
  const addTodo = useCallback(async (payload: string) => {
    // Validation
    if (!payload) {
      return;
    }

    // Generate new instance of todo
    const newTodo = {
      id: generateId(),
      text: payload,
    };

    // Trigger event
    addedTodo(newTodo);
  }, []);

  // Effects
  useEffect(() => {
    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitialized) {
      return;
    }

    // Set a timeout/debounce for running the save effect
    const saveTimeout = setTimeout(async () => {
      toggledSaveState(true);
      await todosService.saveTodos(todos);
      toggledSaveState(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      toggledSaveState(false);
    };
  }, [isInitialized, todos]);

  // We have to use another effect to
  // perform the initialization of the todos
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
      <pre>react-naive</pre>
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
