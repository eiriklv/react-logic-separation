import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TodosModelContext } from "./todos-model.context";
import { Todo } from "../types";

export const useTodosModel = () => {
  // Dependencies
  const {
    fetchTodosCommand,
    saveTodosCommand,
    generateId,
    waitTimeBeforeSave,
  } = useContext(TodosModelContext);

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

  // Effects
  useEffect(() => {
    // Validation (only auto-save after the data has been initialized/loaded)
    if (!isInitialized) {
      return;
    }

    // Set a timeout/debounce for running the save effect
    const saveTimeout = setTimeout(async () => {
      toggledSaveState(true);
      await saveTodosCommand(todos);
      toggledSaveState(false);
    }, waitTimeBeforeSave);

    // Return handle for cancelling debounced save
    return () => {
      clearTimeout(saveTimeout);
      toggledSaveState(false);
    };
  }, [isInitialized, saveTodosCommand, todos, waitTimeBeforeSave]);

  // Commands
  const initializeTodos = useCallback(async () => {
    // Run side effect
    const todos = await fetchTodosCommand();

    // Trigger event
    initializedTodos(todos);
  }, [fetchTodosCommand]);

  const addTodo = useCallback(
    async (payload: string) => {
      // Input validation
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
    },
    [generateId],
  );

  // Public model interface
  return {
    isInitialized,
    isSaving,
    todos,
    todosCount,
    addTodo,
    initializeTodos,
  };
};
