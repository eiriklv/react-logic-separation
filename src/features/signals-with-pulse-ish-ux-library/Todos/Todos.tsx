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
  const handleTodoInputTextChange = useCallback((newInputText: string) => {
    setTodoInputText(newInputText);
  }, []);

  // Create local view event handler for form
  const handleTodoInputEnter = useCallback(() => {
    addTodo(todoInputText);
    setTodoInputText("");
  }, [addTodo, todoInputText]);

  if (!isInitialized) {
    return <Text>Loading...</Text>;
  }

  const todoElements = todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo}></TodoItem>
  ));

  return (
    <VerticalFlex>
      <Text>signals</Text>
      <Heading size={3}>Todos {isSaving && "(saving...)"}</Heading>
      <Heading size={4}>Things to do: {todosCount}</Heading>
      <StringInput
        value={todoInputText}
        onChange={handleTodoInputTextChange}
        onApply={handleTodoInputEnter}
      />
      <Container>{todoElements}</Container>
    </VerticalFlex>
  );
}
