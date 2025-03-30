import { QueryClient } from "@tanstack/query-core";
import { render, screen, waitFor } from "@testing-library/react";
import { Tasks } from "./Tasks.view";
import {
  ActionsViewModelContext,
  ActionsViewModelContextInterface,
} from "./containers/Actions/Actions.view-model.context";
import { TasksModel, TasksModelDependencies } from "./models/tasks.model";
import { Task, User } from "./types";
import { UsersModel, UsersModelDependencies } from "./models/users.model";
import {
  FiltersViewModelContext,
  FiltersViewModelContextInterface,
} from "./containers/Filters/Filters.view-model.context";
import { SelectedFiltersModel } from "./models/selected-filters.model";
import {
  TaskListViewModelContext,
  TaskListViewModelContextInterface,
} from "./containers/TaskList/TaskList.view-model.context";
import {
  TaskItemViewModelContext,
  TaskItemViewModelContextInterface,
} from "./containers/TaskItem/TaskItem.view-model.context";
import { createUserModel, UserModelDependencies } from "./models/user.model";
import userEvent from "@testing-library/user-event";
import {
  defaultValue as defaultTasksDependencies,
  TasksContext,
  TasksContextInterface,
} from "./Tasks.view.context";
import {
  ActionsContext,
  ActionsContextInterface,
} from "./containers/Actions/Actions.view.context";
import { useActionsViewModel } from "./containers/Actions/Actions.view-model";
import {
  FiltersContext,
  FiltersContextInterface,
} from "./containers/Filters/Filters.view.context";
import { useFiltersViewModel } from "./containers/Filters/Filters.view-model";
import {
  TaskListContext,
  TaskListContextInterface,
} from "./containers/TaskList/TaskList.view.context";
import { TaskItem } from "./containers/TaskItem/TaskItem.view";
import { useTaskListViewModel } from "./containers/TaskList/TaskList.view-model";
import { createProviderTree } from "../../../lib/create-provider-tree";

/**
 * This one actually catches more integration errors than
 * the one below, just for the fact that it will use the
 * default dependencies, which might have been imported wrong
 */
describe("Tasks Integration (only necessary dependencies)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock tasks
    const mockTasks: Task[] = [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ];

    // create mock users
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

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

    // Create fake user

    // Create dependencies for UserModel
    const userModelDependencies: UserModelDependencies = {
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
    };

    // Create dependencies for TaskItemViewModel
    const taskItemViewModelDependencies: TaskItemViewModelContextInterface = {
      tasksModel,
      createUserModel: (userId) => {
        return createUserModel(userId, queryClient, userModelDependencies);
      },
    };

    // Create provider tree for dependencies
    const Providers = createProviderTree([
      <TaskItemViewModelContext.Provider
        value={taskItemViewModelDependencies}
      />,
      <TaskListViewModelContext.Provider
        value={taskListViewModelDependencies}
      />,
      <FiltersViewModelContext.Provider value={filtersViewModelDependencies} />,
      <ActionsViewModelContext.Provider value={actionsViewModelDependencies} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <Tasks />
      </Providers>,
    );

    // wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    );

    // assert
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    expect(screen.getByText(/Task 4/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 4/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "User 1",
    );

    // assert
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 2/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "User 2",
    );

    // assert
    expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    expect(screen.getByText(/Task 4/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 2/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "All",
    );

    // assert
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    expect(screen.getByText(/Task 4/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 4/)).toBeInTheDocument();
  });
});

describe("Tasks Integration (all dependencies explicit)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock tasks
    const mockTasks: Task[] = [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ];

    // create mock users
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

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
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
    };

    // Create dependencies for TaskItemViewModel
    const taskItemViewModelDependencies: TaskItemViewModelContextInterface = {
      tasksModel,
      createUserModel: (userId) => {
        return createUserModel(userId, queryClient, userModelDependencies);
      },
    };

    // Create dependencies for TaskList
    const taskListDependencies: TaskListContextInterface = {
      TaskItem,
      useTaskListViewModel,
    };

    // Create dependencies for Filters
    const filtersDependencies: FiltersContextInterface = {
      useFiltersViewModel,
    };

    // Create dependencies for Actions
    const actionsDependencies: ActionsContextInterface = {
      useActionsViewModel,
    };

    // Create dependencies for Tasks
    const tasksDependencies: TasksContextInterface = {
      Actions: defaultTasksDependencies.Actions,
      Filters: defaultTasksDependencies.Filters,
      TaskList: defaultTasksDependencies.TaskList,
    };

    // Create provider tree for dependencies
    const Providers = createProviderTree([
      <TaskItemViewModelContext.Provider
        value={taskItemViewModelDependencies}
      />,
      <TaskListViewModelContext.Provider
        value={taskListViewModelDependencies}
      />,
      <FiltersViewModelContext.Provider value={filtersViewModelDependencies} />,
      <ActionsViewModelContext.Provider value={actionsViewModelDependencies} />,
      <TaskListContext.Provider value={taskListDependencies} />,
      <FiltersContext.Provider value={filtersDependencies} />,
      <ActionsContext.Provider value={actionsDependencies} />,
      <TasksContext.Provider value={tasksDependencies} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <Tasks />
      </Providers>,
    );

    // wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    );

    // assert
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    expect(screen.getByText(/Task 4/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 4/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "User 1",
    );

    // assert
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 2/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "User 2",
    );

    // assert
    expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    expect(screen.getByText(/Task 4/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 2/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "All",
    );

    // assert
    expect(screen.getByText(/Task 1/)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/)).toBeInTheDocument();
    expect(screen.getByText(/Task 3/)).toBeInTheDocument();
    expect(screen.getByText(/Task 4/)).toBeInTheDocument();
    expect(screen.getByText(/Count: 4/)).toBeInTheDocument();
  });
});
