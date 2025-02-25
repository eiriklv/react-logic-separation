import { Meta, StoryObj } from "@storybook/react";
import { Todos, TodosContextInterface, TodosContext } from "./Todos";

const meta = {
  component: Todos,
  title: "Todos",
  decorators: [
    (story, { parameters }) => {
      return (
        <TodosContext.Provider value={parameters.dependencies}>
          {story()}
        </TodosContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Todos>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UninitializedList: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodosModel: () => ({
        todos: [],
        todosCount: 0,
        addTodo: async () => {},
        initializeTodos: async () => {},
        isInitialized: false,
        isSaving: false,
      }),
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};

export const EmptyList: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodosModel: () => ({
        todos: [],
        todosCount: 0,
        addTodo: async () => {},
        initializeTodos: async () => {},
        isInitialized: true,
        isSaving: false,
      }),
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};

export const ListWithItems: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodosModel: () => ({
        todos: [
          { id: "1", text: "Buy milk" },
          { id: "2", text: "Paint house" },
        ],
        todosCount: 2,
        addTodo: async () => {},
        initializeTodos: async () => {},
        isInitialized: true,
        isSaving: false,
      }),
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};

export const SavingTodos: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodosModel: () => ({
        todos: [
          { id: "1", text: "Buy milk" },
          { id: "2", text: "Paint house" },
        ],
        todosCount: 2,
        addTodo: async () => {},
        initializeTodos: async () => {},
        isInitialized: true,
        isSaving: true,
      }),
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};
