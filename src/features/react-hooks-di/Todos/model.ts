import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as todosService from "./services/todos.service";
import { generateId } from "../../../lib/utils";

export interface Todo {
  id: string;
  text: string;
}

export const useTodosModel = () => {
  // Dependencies
  const { todosService, generateId, waitTimeBeforeSave } =
    useContext(TodosModelContext);

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
  }, [todosService]);
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
  }, [isInitialized, todos, todosService, waitTimeBeforeSave]);

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

/**
 * The context can be used to inject any kind of
 * dependency, but mainly hooks and components/containers.
 *
 * The main purpose is to facilitate testing
 * and storybooking without having to make complex mocks
 * - and to keep the components as simple as possible.
 *
 * Can be used for integrating 3rd party libraries and
 * components into your application
 *
 * The other purpose is to completely avoid prop drilling,
 * which reduces the amount of indirection in components.
 *
 * The interfaces of the components also become much simpler.
 */

export interface TodosModelContextInterface {
  todosService: typeof todosService;
  generateId: typeof generateId;
  waitTimeBeforeSave: number;
}

export const defaultValue: TodosModelContextInterface = {
  todosService,
  generateId,
  waitTimeBeforeSave: 1000,
};

export const TodosModelContext =
  createContext<TodosModelContextInterface>(defaultValue);
