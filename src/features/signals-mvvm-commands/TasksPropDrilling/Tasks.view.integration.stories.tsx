import { Meta, StoryObj } from "@storybook/react";
import { Tasks, TasksDependencies } from "./Tasks.view";
import { QueryClient } from "@tanstack/query-core";
import { Task, User } from "./types";
import { TasksModel, TasksModelDependencies } from "./models/tasks.model";
import { UsersModel, UsersModelDependencies } from "./models/users.model";
import { SelectedFiltersModel } from "./models/selected-filters.model";
import { createUserModel, UserModelDependencies } from "./models/user.model";
import {
  ActionsViewModelDependencies,
  useActionsViewModel,
} from "./containers/Actions/Actions.view-model";
import {
  FiltersViewModelDependencies,
  useFiltersViewModel,
} from "./containers/Filters/Filters.view-model";
import {
  TaskListViewModelDependencies,
  useTaskListViewModel,
} from "./containers/TaskList/TaskList.view-model";
import {
  TaskItemViewModelDependencies,
  TaskItemViewModelProps,
  useTaskItemViewModel,
} from "./containers/TaskItem/TaskItem.view-model";
import {
  TaskItem,
  TaskItemDependencies,
} from "./containers/TaskItem/TaskItem.view";
import {
  TaskList,
  TaskListDependencies,
} from "./containers/TaskList/TaskList.view";
import { ComponentProps } from "react";
import {
  Filters,
  FiltersDependencies,
} from "./containers/Filters/Filters.view";
import {
  Actions,
  ActionsDependencies,
} from "./containers/Actions/Actions.view";

const meta = {
  render: (_, { parameters }) => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock tasks
    const mockTasks: Task[] = parameters.tasks;

    // create mock users
    const mockUsers: User[] = parameters.users;

    // Create tasks model dependencies
    const tasksModelDependencies: TasksModelDependencies = {
      listTasksCommand: async () => mockTasks,
      addTaskCommand: async () => ({
        id: "1",
        text: "task",
        ownerId: "user-1",
      }),
      deleteTaskCommand: async () => {},
    };

    // Create tasks model
    const tasksModel = new TasksModel(queryClient, tasksModelDependencies);

    // Create users model dependencies
    const usersModelDependencies: UsersModelDependencies = {
      listUsersCommand: async () => mockUsers,
    };

    // Create users model
    const usersModel = new UsersModel(queryClient, usersModelDependencies);

    // Create selected filters model
    const selectedFiltersModel = new SelectedFiltersModel();

    // Create dependencies for ActionsViewModel
    const actionsViewModelDependencies: ActionsViewModelDependencies = {
      tasksModel,
      usersModel,
    };

    // Create dependencies for FiltersViewModel
    const filtersViewModelDependencies: FiltersViewModelDependencies = {
      selectedFiltersModel,
      usersModel,
    };

    // Create dependencies for TaskListViewModel
    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      selectedFiltersModel,
      tasksModel,
    };

    // Create dependencies for UserModel
    const userModelDependencies: UserModelDependencies = {
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
    };

    // Create dependencies for TaskItemViewModel
    const taskItemViewModelDependencies: TaskItemViewModelDependencies = {
      tasksModel,
      createUserModel: (userId) => {
        return createUserModel(userId, queryClient, userModelDependencies);
      },
    };

    // Create dependencies for TaskItem
    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: (props: TaskItemViewModelProps) =>
        useTaskItemViewModel({
          dependencies: taskItemViewModelDependencies,
          ...props,
        }),
    };

    // Create dependencies for TaskList
    const taskListDependencies: TaskListDependencies = {
      TaskItem: (props: ComponentProps<typeof TaskItem>) => (
        <TaskItem dependencies={taskItemDependencies} {...props} />
      ),
      useTaskListViewModel: () =>
        useTaskListViewModel({ dependencies: taskListViewModelDependencies }),
    };

    // Create dependencies for Filters
    const filtersDependencies: FiltersDependencies = {
      useFiltersViewModel: () =>
        useFiltersViewModel({ dependencies: filtersViewModelDependencies }),
    };

    // Create dependencies for Actions
    const actionsDependencies: ActionsDependencies = {
      useActionsViewModel: () =>
        useActionsViewModel({ dependencies: actionsViewModelDependencies }),
    };

    // Create dependencies for Tasks
    const tasksDependencies: TasksDependencies = {
      Actions: () => <Actions dependencies={actionsDependencies} />,
      Filters: () => <Filters dependencies={filtersDependencies} />,
      TaskList: () => <TaskList dependencies={taskListDependencies} />,
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    return <Tasks dependencies={tasksDependencies} />;
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tasks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
  parameters: {
    tasks: [] satisfies Task[],
    users: [] satisfies User[],
  },
};
