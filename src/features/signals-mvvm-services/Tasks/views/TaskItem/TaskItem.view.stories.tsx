import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TaskItem } from "./TaskItem.view";

const meta = {
  component: TaskItem,
  tags: ["autodocs"],
} satisfies Meta<typeof TaskItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyTask: Story = {
  args: {
    dependencies: {
      useTaskItemViewModel: () => ({
        user: undefined,
        deleteTask: fn(),
      }),
    },
    task: {
      id: "",
      text: "",
      ownerId: "",
    },
  },
};

export const LoadingUser: Story = {
  args: {
    task: {
      id: "1",
      text: "Task 1",
      ownerId: "user-1",
    },
    dependencies: {
      useTaskItemViewModel: () => ({
        user: undefined,
        deleteTask: fn(),
      }),
    },
  },
};

export const LoadedUser: Story = {
  args: {
    task: {
      id: "1",
      text: "Task 1",
      ownerId: "user-1",
    },
    dependencies: {
      useTaskItemViewModel: () => ({
        user: {
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/abc.jpg",
        },
        deleteTask: fn(),
      }),
    },
  },
};
