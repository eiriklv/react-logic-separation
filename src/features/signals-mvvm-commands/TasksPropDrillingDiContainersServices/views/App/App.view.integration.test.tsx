import { render, screen, waitFor } from "@testing-library/react";
import { App } from "./App.view";
import { Task, User } from "../../types";
import userEvent from "@testing-library/user-event";
import { createProviderTree } from "../../../../../lib/create-provider-tree";
import { QueryClientProvider } from "@tanstack/react-query";
import { Actions } from "../Actions/Actions.view";
import { Filters } from "../Filters/Filters.view";
import { TaskList } from "../TaskList/TaskList.view";
import { useActionsViewModel } from "../Actions/Actions.view-model";
import { useFiltersViewModel } from "../Filters/Filters.view-model";
import { useTaskListViewModel } from "../TaskList/TaskList.view-model";
import { TaskItem } from "../TaskItem/TaskItem.view";
import { useTaskItemViewModel } from "../TaskItem/TaskItem.view-model";
import {
  createUserModel,
  UserModelDependencies,
} from "../../models/user.model";
import { SelectedFiltersModel } from "../../models/selected-filters.model";
import { UsersModel, UsersModelDependencies } from "../../models/users.model";
import { TasksModel, TasksModelDependencies } from "../../models/tasks.model";
import { ActionsDependencies } from "../Actions/Actions.view.dependencies";
import { TaskItemViewModelDependencies } from "../TaskItem/TaskItem.view-model.dependencies";
import { TaskItemDependencies } from "../TaskItem/TaskItem.view.dependencies";
import { TaskListDependencies } from "../TaskList/TaskList.view.dependencies";
import { FiltersDependencies } from "../Filters/Filters.view.dependencies";
import { AppDependencies } from "./App.view.dependencies";
import { createQueryClient } from "../../utils/create-query-client";
import { FiltersViewModelDependencies } from "../Filters/Filters.view-model.dependencies";
import { ModelsContextInterface } from "../../providers/models.provider";
import { ActionsViewModelDependencies } from "../Actions/Actions.view-model.dependencies";
import { TaskListViewModelDependencies } from "../TaskList/TaskList.view-model.dependencies";
import {
  ServicesContext,
  ServicesContextInterface,
} from "../../providers/services.provider";

describe("App Integration (only service layer mocked)", () => {
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

    // create mock services
    const services: ServicesContextInterface = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi.fn(async () => mockTasks),
      },
      usersService: {
        getUserById: vi.fn(async (userId) => {
          return mockUsers.find((user) => user.id === userId);
        }),
        listUsers: vi.fn(async () => mockUsers),
      },
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <QueryClientProvider client={queryClient} />,
      <ServicesContext.Provider value={services} />,
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

    // Create fake services to inject, as these won't actually be used anywhere
    const services = {} as ServicesContextInterface;

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
      tasksService: {
        addTask: async () => ({
          id: "1",
          text: "task",
          ownerId: "user-1",
        }),
        deleteTask: vi.fn(),
        listTasks: vi.fn(async () => mockTasks),
      },
    };

    // Create tasks model
    const tasksModel = new TasksModel(queryClient, tasksModelDependencies);

    // Create users model dependencies
    const usersModelDependencies: UsersModelDependencies = {
      usersService: {
        listUsers: vi.fn(async () => mockUsers),
      },
    };

    // Create users model
    const usersModel = new UsersModel(queryClient, usersModelDependencies);

    // Create selected filters model
    const selectedFiltersModel = new SelectedFiltersModel();

    // Create shared models container
    const models: ModelsContextInterface = {
      selectedFiltersModel,
      tasksModel,
      usersModel,
    };

    // Create dependencies for UserModel
    const userModelDependencies: UserModelDependencies = {
      usersService: {
        getUserById: vi.fn(async (userId) => {
          return mockUsers.find((user) => user.id === userId);
        }),
      },
    };

    // Create dependencies for TaskItemViewModel
    const taskItemViewModelDependencies: TaskItemViewModelDependencies = {
      createUserModel: (userId) => {
        return createUserModel(userId, queryClient, userModelDependencies);
      },
      useServices: () => services,
      useModels: () => models,
      useQueryClient: () => queryClient,
    };

    // Create dependencies for TaskItem
    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: (props) =>
        useTaskItemViewModel({
          ...props,
          dependencies: taskItemViewModelDependencies,
        }),
    };

    // Create dependencies for TaskListViewModel
    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      useModels: () => models,
    };

    // Create dependencies for TaskList
    const taskListDependencies: TaskListDependencies = {
      TaskItem: (props) => (
        <TaskItem {...props} dependencies={taskItemDependencies} />
      ),
      useTaskListViewModel: () =>
        useTaskListViewModel({ dependencies: taskListViewModelDependencies }),
    };

    // Create dependencies for FiltersViewModel
    const filtersViewModelDependencies: FiltersViewModelDependencies = {
      useModels: () => models,
    };

    // Create dependencies for Filters
    const filtersDependencies: FiltersDependencies = {
      useFiltersViewModel: () =>
        useFiltersViewModel({ dependencies: filtersViewModelDependencies }),
    };

    // Create dependencies for ActionsViewModel
    const actionsViewModelDependencies: ActionsViewModelDependencies = {
      useModels: () => models,
    };

    // Create dependencies for Actions
    const actionsDependencies: ActionsDependencies = {
      useActionsViewModel: () =>
        useActionsViewModel({ dependencies: actionsViewModelDependencies }),
    };

    // Create dependencies for App
    const appDependencies: AppDependencies = {
      useAppViewModel: () => ({ models }),
      Actions: () => <Actions dependencies={actionsDependencies} />,
      Filters: () => <Filters dependencies={filtersDependencies} />,
      TaskList: () => <TaskList dependencies={taskListDependencies} />,
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<App dependencies={appDependencies} />);

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
