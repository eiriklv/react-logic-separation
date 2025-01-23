import { generateId } from "../../../lib/utils";
import * as todosService from "./services/todos.service";
import { useCallback, useEffect, useMemo, useState } from "react";

const waitTimeBeforeSave = 1000;

export interface Todo {
  id: string;
  text: string;
}

/**
 * NOTE: An issue with using hooks as the model instances
 * is that there is no simple way of creating a "long lived"
 * instance that does not get reset if the component using
 * it is re-rendered
 */
export const useTodosModel = () => {
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
