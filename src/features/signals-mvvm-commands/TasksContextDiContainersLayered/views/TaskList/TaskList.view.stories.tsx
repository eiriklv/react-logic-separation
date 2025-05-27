import { Meta, StoryObj } from "@storybook/react";
import { TaskListContext } from "./TaskList.view.context";
import { TaskList } from "./TaskList.view";
import { TaskListDependencies } from "./TaskList.view.dependencies";

const meta = {
  component: TaskList,

  decorators: [
    (story, { parameters }) => {
      return (
        <TaskListContext.Provider value={parameters.dependencies}>
          {story()}
        </TaskListContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof TaskList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {},
  parameters: {
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
    } satisfies TaskListDependencies,
  },
};

export const EmptyList: Story = {
  args: {},
  parameters: {
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
    } satisfies TaskListDependencies,
  },
};

export const WithTasks: Story = {
  args: {},
  parameters: {
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
    } satisfies TaskListDependencies,
  },
};

export const Saving: Story = {
  args: {},
  parameters: {
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
    } satisfies TaskListDependencies,
  },
};

export const Refetching: Story = {
  args: {},
  parameters: {
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
    } satisfies TaskListDependencies,
  },
};
