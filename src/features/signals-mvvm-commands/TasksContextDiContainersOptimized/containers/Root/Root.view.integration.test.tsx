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
import { QueryClientProvider } from "@tanstack/react-query";
import { RootViewModelContext } from "./Root.view-model.context";
import { RootContext } from "./Root.view.context";

describe("Root Integration (view-model layer)", () => {
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
      addTaskCommand: async () => ({
        id: "1",
        text: "task",
        ownerId: "user-1",
      }),
      listTasksCommand: async () => mockTasks,
      deleteTaskCommand: async () => {},
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
      listUsersCommand: async () => mockUsers,
    };

    // create root view model dependencies
    const rootViewModelDependencies: RootViewModelDependencies = {
      createAddTaskCommand: () => commands.addTaskCommand,
      createDeleteTaskCommand: () => commands.deleteTaskCommand,
      createGetUserCommand: () => commands.getUserCommand,
      createListTasksCommand: () => commands.listTasksCommand,
      createListUsersCommand: () => commands.listUsersCommand,
      createQueryClient: () => queryClient,
      createTasksService: () => ({}) as ITasksService,
      createUsersService: () => ({}) as IUsersService,
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <QueryClientProvider client={queryClient} />,
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

describe("Root Integration (view layer)", () => {
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
      addTaskCommand: async () => ({
        id: "1",
        text: "task",
        ownerId: "user-1",
      }),
      listTasksCommand: async () => mockTasks,
      deleteTaskCommand: async () => {},
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
      listUsersCommand: async () => mockUsers,
    };

    // create root dependencies
    const rootDependencies: RootDependencies = {
      App: defaultDependencies.App,
      useRootViewModel: () => ({
        commands,
        queryClient,
      }),
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <QueryClientProvider client={queryClient} />,
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
