import { render, screen, waitFor } from "@testing-library/react";
import { App } from "./App.view";
import { Task, User } from "../../types";
import userEvent from "@testing-library/user-event";
import { createProviderTree } from "../../../../../lib/create-provider-tree";
import {
  CommandsContext,
  CommandsContextInterface,
} from "../../providers/commands.provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAppViewModel } from "./App.view-model";
import { Actions } from "../Actions/Actions.view";
import { Filters } from "../Filters/Filters.view";
import { TaskList } from "../TaskList/TaskList.view";
import { useActionsViewModel } from "../Actions/Actions.view-model";
import { useFiltersViewModel } from "../Filters/Filters.view-model";
import { useTaskListViewModel } from "../TaskList/TaskList.view-model";
import { ComponentProps } from "react";
import { TaskItem } from "../TaskItem/TaskItem.view";
import {
  TaskItemViewModelProps,
  useTaskItemViewModel,
} from "../TaskItem/TaskItem.view-model";
import {
  createUserModel,
  UserModelDependencies,
} from "../../models/user.model";
import { SelectedFiltersModel } from "../../models/selected-filters.model";
import { UsersModel, UsersModelDependencies } from "../../models/users.model";
import { TasksModel, TasksModelDependencies } from "../../models/tasks.model";
import { ActionsDependencies } from "../Actions/Actions.view.dependencies";
import { AppViewModelDependencies } from "./App.view-model.dependencies";
import { TaskItemViewModelDependencies } from "../TaskItem/TaskItem.view-model.dependencies";
import { TaskItemDependencies } from "../TaskItem/TaskItem.view.dependencies";
import { TaskListDependencies } from "../TaskList/TaskList.view.dependencies";
import { FiltersDependencies } from "../Filters/Filters.view.dependencies";
import { AppDependencies } from "./App.view.dependencies";
import { createQueryClient } from "../../utils/create-query-client";

describe("App Integration (only command layer mocked)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
    // create query client for test
    const queryClient = createQueryClient();

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

    // create mock commands
    const commands: CommandsContextInterface = {
      listTasksCommand: async () => mockTasks,
      addTaskCommand: async () => ({
        id: "1",
        text: "task",
        ownerId: "user-1",
      }),
      deleteTaskCommand: async () => {},
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
      listUsersCommand: async () => mockUsers,
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <QueryClientProvider client={queryClient} />,
      <CommandsContext.Provider value={commands} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <App />
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

describe("App Integration (all dependencies explicit)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
    // create query client for test
    const queryClient = createQueryClient();

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

    // Create dependencies for UserModel
    const userModelDependencies: UserModelDependencies = {
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
    };

    // Create dependencies for TaskItemViewModel
    const taskItemViewModelDependencies: TaskItemViewModelDependencies = {
      createUserModel: (userId) => {
        return createUserModel(userId, queryClient, userModelDependencies);
      },
    };

    // Create dependencies for TaskItem
    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: (props: TaskItemViewModelProps) =>
        useTaskItemViewModel({
          ...props,
          dependencies: taskItemViewModelDependencies,
        }),
    };

    // Create dependencies for TaskList
    const taskListDependencies: TaskListDependencies = {
      TaskItem: (props: ComponentProps<typeof TaskItem>) => (
        <TaskItem {...props} dependencies={taskItemDependencies} />
      ),
      useTaskListViewModel,
    };

    // Create dependencies for Filters
    const filtersDependencies: FiltersDependencies = {
      useFiltersViewModel,
    };

    // Create dependencies for Actions
    const actionsDependencies: ActionsDependencies = {
      useActionsViewModel,
    };

    // Create app view model dependencies
    const appViewModelDependencies: AppViewModelDependencies = {
      createSelectedFiltersModel: () => selectedFiltersModel,
      createTasksModel: () => tasksModel,
      createUsersModel: () => usersModel,
    };

    // Create dependencies for Tasks
    const appDependencies: AppDependencies = {
      useAppViewModel: () =>
        useAppViewModel({ dependencies: appViewModelDependencies }),
      Actions: () => <Actions dependencies={actionsDependencies} />,
      Filters: () => <Filters dependencies={filtersDependencies} />,
      TaskList: () => <TaskList dependencies={taskListDependencies} />,
    };

    // Create fake commands to inject
    const commands = {} as CommandsContextInterface;

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <QueryClientProvider client={queryClient}>
        <CommandsContext.Provider value={commands}>
          <App dependencies={appDependencies} />
        </CommandsContext.Provider>
      </QueryClientProvider>,
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
