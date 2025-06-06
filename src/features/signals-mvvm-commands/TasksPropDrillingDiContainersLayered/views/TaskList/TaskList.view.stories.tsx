import { Meta, StoryObj } from "@storybook/react";
import { TaskList } from "./TaskList.view";

const meta = {
  component: TaskList,
  title: "TaskList",
  tags: ["autodocs"],
} satisfies Meta<typeof TaskList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    dependencies: {
      useTaskListViewModel: () => ({
        tasks: [],
        tasksCount: 0,
        addTask: async () => {},
        isLoading: true,
        isSaving: false,
        isFetching: false,
      }),
      TaskItem: ({ task }) => <li>{task.text}</li>,
    },
  },
};

export const EmptyList: Story = {
  args: {
    dependencies: {
      useTaskListViewModel: () => ({
        tasks: [],
        tasksCount: 0,
        addTask: async () => {},
        isLoading: false,
        isSaving: false,
        isFetching: false,
      }),
      TaskItem: ({ task }) => <li>{task.text}</li>,
    },
  },
};

export const WithTasks: Story = {
  args: {
    dependencies: {
      useTaskListViewModel: () => ({
        tasks: [
          { id: "1", text: "Buy milk", ownerId: "user-1" },
          { id: "2", text: "Paint house", ownerId: "user-1" },
        ],
        tasksCount: 2,
        addTask: async () => {},
        isLoading: false,
        isSaving: false,
        isFetching: false,
      }),
      TaskItem: ({ task }) => <li>{task.text}</li>,
    },
  },
};

export const Saving: Story = {
  args: {
    dependencies: {
      useTaskListViewModel: () => ({
        tasks: [
          { id: "1", text: "Buy milk", ownerId: "user-1" },
          { id: "2", text: "Paint house", ownerId: "user-1" },
        ],
        tasksCount: 2,
        addTask: async () => {},
        isLoading: true,
        isSaving: true,
        isFetching: false,
      }),
      TaskItem: ({ task }) => <li>{task.text}</li>,
    },
  },
};

export const Refetching: Story = {
  args: {
    dependencies: {
      useTaskListViewModel: () => ({
        tasks: [
          { id: "1", text: "Buy milk", ownerId: "user-1" },
          { id: "2", text: "Paint house", ownerId: "user-1" },
        ],
        tasksCount: 2,
        addTask: async () => {},
        isLoading: false,
        isSaving: false,
        isFetching: true,
      }),
      TaskItem: ({ task }) => <li>{task.text}</li>,
    },
  },
};
