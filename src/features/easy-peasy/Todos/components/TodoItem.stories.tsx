import { Meta, StoryObj } from "@storybook/react";
import { TodoItem } from "./TodoItem";

const meta = {
  component: TodoItem,
  tags: ["autodocs"],
} satisfies Meta<typeof TodoItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyTodo: Story = {
  args: {
    todo: {
      id: "1",
      text: "",
    },
  },
};

export const ShortTodo: Story = {
  args: {
    todo: {
      id: "1",
      text: "Paint house",
    },
  },
};

export const LongTodo: Story = {
  args: {
    todo: {
      id: "1",
      text: " This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo. This is a very long todo.",
    },
  },
};
