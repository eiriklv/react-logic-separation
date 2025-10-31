import { render, screen, waitFor } from "@testing-library/react";

import { Task, User } from "../../types";
import userEvent from "@testing-library/user-event";
import { CommandsContextInterface } from "../../providers/commands.provider";
import { Root } from "./Root.view";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";
import { createQueryClient } from "../../utils/create-query-client";
import { RootViewModelDependencies } from "./Root.view-model.dependencies";
import { createProviderTree } from "../../../../../lib/create-provider-tree";
import { RootViewModelContext } from "./Root.view-model.context";
import { RootContext } from "./Root.view.context";

import rootViewModelDefaultDependencies from "./Root.view-model.dependencies";

describe("Root Integration (view-model layer services)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
    // create mock tasks
    const mockTasks: Task[] = [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ];

    // create mock tasks service
    const tasksService: ITasksService = {
      addTask: vi.fn(),
      deleteTask: vi.fn(),
      listTasks: vi.fn(async () => mockTasks),
    };

    // create mock users
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

    // create mock users service
    const usersService: IUsersService = {
      getUserById: vi.fn(async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      }),
      listUsers: vi.fn(async () => mockUsers),
    };

    // create root dependencies
    const rootViewModelDependencies: RootViewModelDependencies = {
      /**
       * Use the real dependencies for everything
       */
      ...rootViewModelDefaultDependencies,
      /**
       * ... Except for the services
       */
      createTasksService: vi.fn(() => tasksService),
      createUsersService: vi.fn(() => usersService),
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <RootViewModelContext.Provider value={rootViewModelDependencies} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <Root />
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

describe("Root Integration (view-model layer commands)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
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
      addTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(async () => mockTasks),
      deleteTaskCommand: vi.fn(),
      getUserCommand: vi.fn(async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      }),
      listUsersCommand: vi.fn(async () => mockUsers),
    };

    // create root view model dependencies
    const rootViewModelDependencies: RootViewModelDependencies = {
      /**
       * Use the real query client, since we
       * want to ensure that we've configured
       * the client correctly
       */
      createQueryClient: rootViewModelDefaultDependencies.createQueryClient,
      /**
       * In this scenario we can ignore the services,
       * since we're providing the commands (which are downstream of the services)
       */
      createTasksService: vi.fn(),
      createUsersService: vi.fn(),
      /**
       * Create mocked commands
       */
      createAddTaskCommand: vi.fn(() => commands.addTaskCommand),
      createDeleteTaskCommand: vi.fn(() => commands.deleteTaskCommand),
      createGetUserCommand: vi.fn(() => commands.getUserCommand),
      createListTasksCommand: vi.fn(() => commands.listTasksCommand),
      createListUsersCommand: vi.fn(() => commands.listUsersCommand),
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <RootViewModelContext.Provider value={rootViewModelDependencies} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <Root />
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

describe("Root Integration (view layer commands)", () => {
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
      addTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(async () => mockTasks),
      deleteTaskCommand: vi.fn(),
      getUserCommand: vi.fn(async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      }),
      listUsersCommand: vi.fn(async () => mockUsers),
    };

    // create root dependencies
    const rootDependencies: RootDependencies = {
      App: defaultDependencies.App,
      useRootViewModel: vi.fn(() => ({
        commands,
        queryClient,
      })),
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <RootContext.Provider value={rootDependencies} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <Root />
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
