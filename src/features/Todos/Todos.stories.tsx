import { Meta, StoryObj } from "@storybook/react";
import { TodosContextInterface, TodosContext } from "./context";
import { Todos } from "./Todos";

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
      useTodos: () => [],
      useAddTodo: () => () => {},
      useIsInitialized: () => false,
      useIsSaving: () => false,
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};

export const EmptyList: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodos: () => [],
      useAddTodo: () => () => {},
      useIsInitialized: () => true,
      useIsSaving: () => false,
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};

export const ListWithItems: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodos: () => [
        { id: "1", text: "Buy milk" },
        { id: "2", text: "Paint house" },
      ],
      useAddTodo: () => () => {},
      useIsInitialized: () => true,
      useIsSaving: () => false,
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};

export const SavingTodos: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTodos: () => [
        { id: "1", text: "Buy milk" },
        { id: "2", text: "Paint house" },
      ],
      useAddTodo: () => () => {},
      useIsInitialized: () => true,
      useIsSaving: () => true,
      TodoItem: ({ todo }) => <li>{todo.text}</li>,
    } satisfies TodosContextInterface,
  },
};