import { Meta, StoryObj } from "@storybook/react";
import { Tasks } from "./Tasks.view";
import {
  TaskItemViewModelContext,
  TaskItemViewModelContextInterface,
} from "./containers/TaskItem/TaskItem.view-model.context";
import {
  TaskListViewModelContext,
  TaskListViewModelContextInterface,
} from "./containers/TaskList/TaskList.view-model.context";
import {
  FiltersViewModelContext,
  FiltersViewModelContextInterface,
} from "./containers/Filters/Filters.view-model.context";
import {
  ActionsViewModelContext,
  ActionsViewModelContextInterface,
} from "./containers/Actions/Actions.view-model.context";
import { QueryClient } from "@tanstack/query-core";
import { Task, User } from "./types";
import { TasksModel, TasksModelDependencies } from "./models/tasks.model";
import { UsersModel, UsersModelDependencies } from "./models/users.model";
import { SelectedFiltersModel } from "./models/selected-filters.model";
import { createUserModel, UserModelDependencies } from "./models/user.model";

const meta = {
  component: Tasks,
  title: "Tasks",
  decorators: [
    (story, { parameters }) => {
      // create query client for test
      const queryClient = new QueryClient();

      // create mock tasks
      const mockTasks: Task[] = parameters.tasks;

      // create mock users
      const mockUsers: User[] = parameters.users;

      // Create tasks model dependencies
      const tasksModelDependencies: TasksModelDependencies = {
        tasksService: {
          listTasks: async () => mockTasks,
          addTask: async () => ({
            id: "1",
            text: "task",
            ownerId: "user-1",
          }),
          deleteTask: async () => {},
        },
      };

      // Create tasks model
      const tasksModel = new TasksModel(queryClient, tasksModelDependencies);

      // Create users model dependencies
      const usersModelDependencies: UsersModelDependencies = {
        listUsers: async () => mockUsers,
      };

      // Create users model
      const usersModel = new UsersModel(queryClient, usersModelDependencies);

      // Create selected filters model
      const selectedFiltersModel = new SelectedFiltersModel();

      // Create dependencies for ActionsViewModel
      const actionsViewModelDependencies: ActionsViewModelContextInterface = {
        tasksModel,
        usersModel,
      };

      // Create dependencies for FiltersViewModel
      const filtersViewModelDependencies: FiltersViewModelContextInterface = {
        selectedFiltersModel,
        usersModel,
      };

      // Create dependencies for TaskListViewModel
      const taskListViewModelDependencies: TaskListViewModelContextInterface = {
        selectedFiltersModel,
        tasksModel,
      };

      // Create dependencies for UserModel
      const userModelDependencies: UserModelDependencies = {
        usersService: {
          listUsers: vi.fn(),
          getUserById: async (userId) => {
            return mockUsers.find((user) => user.id === userId);
          },
        },
      };

      // Create dependencies for TaskItemViewModel
      const taskItemViewModelDependencies: TaskItemViewModelContextInterface = {
        tasksModel,
        createUserModel: (userId) => {
          return createUserModel(userId, queryClient, userModelDependencies);
        },
      };

      return (
        <TaskItemViewModelContext.Provider
          value={taskItemViewModelDependencies}
        >
          <TaskListViewModelContext.Provider
            value={taskListViewModelDependencies}
          >
            <FiltersViewModelContext.Provider
              value={filtersViewModelDependencies}
            >
              <ActionsViewModelContext.Provider
                value={actionsViewModelDependencies}
              >
                {story()}
              </ActionsViewModelContext.Provider>
            </FiltersViewModelContext.Provider>
          </TaskListViewModelContext.Provider>
        </TaskItemViewModelContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Tasks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    tasks: [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ] satisfies Task[],
    users: [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ] satisfies User[],
  },
};

export const NoTasksNoUsers: Story = {
  args: {},
  parameters: {
    tasks: [] satisfies Task[],
    users: [] satisfies User[],
  },
};
