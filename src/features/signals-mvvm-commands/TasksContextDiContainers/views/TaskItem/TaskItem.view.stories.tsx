import { Meta, StoryObj } from "@storybook/react";
import {
  TaskItemContext,
  TaskItemContextInterface,
} from "./TaskItem.view.context";
import { TaskItem } from "./TaskItem.view";

const meta = {
  component: TaskItem,

  decorators: [
    (story, { parameters }) => {
      return (
        <TaskItemContext.Provider value={parameters.dependencies}>
          {story()}
        </TaskItemContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof TaskItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyTask: Story = {
  args: {
    task: {
      id: "",
      text: "",
      ownerId: "",
    },
  },
  parameters: {
    dependencies: {
      useTaskItemViewModel: () => ({
        user: undefined,
        deleteTask: async () => {},
      }),
    } satisfies TaskItemContextInterface,
  },
};

export const LoadingUser: Story = {
  args: {
    task: {
      id: "1",
      text: "Task 1",
      ownerId: "user-1",
    },
  },
  parameters: {
    dependencies: {
      useTaskItemViewModel: () => ({
        user: undefined,
        deleteTask: async () => {},
      }),
    } satisfies TaskItemContextInterface,
  },
};

export const LoadedUser: Story = {
  args: {
    task: {
      id: "1",
      text: "Task 1",
      ownerId: "user-1",
    },
  },
  parameters: {
    dependencies: {
      useTaskItemViewModel: () => ({
        user: {
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/abc.jpg",
        },
        deleteTask: async () => {},
      }),
    } satisfies TaskItemContextInterface,
  },
};
