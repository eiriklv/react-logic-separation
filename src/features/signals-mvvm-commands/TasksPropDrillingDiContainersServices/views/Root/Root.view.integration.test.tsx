import { render, screen, waitFor } from "@testing-library/react";

import { Task, User } from "../../types";
import userEvent from "@testing-library/user-event";
import { Root } from "./Root.view";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";
import { createQueryClient } from "../../utils/create-query-client";

import rootViewModelDefaultDependencies from "./Root.view-model.dependencies";
import { ServicesContextInterface } from "../../providers/services.provider";
import { ModelsContextInterface } from "../../providers/models.provider";

describe("Root Integration (view-model layer services)", () => {
  it("should reflect changes when deleting a task in all applicable views", async () => {
    // create mock tasks
    const mockTasks: Task[] = [
      { id: "task-1", ownerId: "user-1", text: "Paint house" },
    ];

    // create mock tasks service
    const tasksService: ITasksService = {
      addTask: vi.fn(),
      deleteTask: vi.fn(async (taskId) => {
        mockTasks.splice(
          mockTasks.findIndex(({ id }) => taskId === id),
          1,
        );
      }),
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
    const rootDependencies: RootDependencies = {
      App: defaultDependencies.App,
      useRootViewModel: () =>
        defaultDependencies.useRootViewModel({
          dependencies: {
            /**
             * Use real dependencies
             */
            ...rootViewModelDefaultDependencies,
            /**
             * ... Except for the services
             */
            createTasksService: () => tasksService,
            createUsersService: () => usersService,
          },
        }),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

    // wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    );

    // act
    await userEvent.click(screen.getByRole("button", { name: "X" }));

    // wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Paint house/)).not.toBeInTheDocument(),
    );
  });

  it("should reflect changes when adding a task in all applicable views", async () => {
    // create mock tasks
    const mockTasks: Task[] = [];

    // create mock tasks service
    const tasksService: ITasksService = {
      addTask: vi.fn(async (text, ownerId) => {
        const newTask: Task = {
          id: "new-task",
          ownerId,
          text,
        };

        mockTasks.push(newTask);

        return newTask;
      }),
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
    const rootDependencies: RootDependencies = {
      App: defaultDependencies.App,
      useRootViewModel: () =>
        defaultDependencies.useRootViewModel({
          dependencies: {
            /**
             * Use the real dependencies
             */
            ...rootViewModelDefaultDependencies,
            /**
             * ... Except for the services
             */
            createTasksService: () => tasksService,
            createUsersService: () => usersService,
          },
        }),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

    // wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    );

    // act
    await userEvent.type(screen.getByLabelText("Add task"), "Paint house");
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "User:" }),
      "User 1",
    );
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    // wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Paint house/)).toBeInTheDocument(),
    );
  });

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
    const rootDependencies: RootDependencies = {
      App: defaultDependencies.App,
      useRootViewModel: () =>
        defaultDependencies.useRootViewModel({
          dependencies: {
            /**
             * Use the real dependencies
             */
            ...rootViewModelDefaultDependencies,
            /**
             * ... Except for the services
             */
            createTasksService: () => tasksService,
            createUsersService: () => usersService,
          },
        }),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

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

describe("Root Integration (view layer services and models)", () => {
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
        addTask: async (text, ownerId) => {
          const newTask: Task = {
            id: "new-task",
            ownerId,
            text,
          };

          mockTasks.push(newTask);

          return newTask;
        },
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

    // create mock models
    const models: ModelsContextInterface = {
      tasksModel: rootViewModelDefaultDependencies.createTasksModel(
        queryClient,
        services,
      ),
      usersModel: rootViewModelDefaultDependencies.createUsersModel(
        queryClient,
        services,
      ),
      selectedFiltersModel:
        rootViewModelDefaultDependencies.createSelectedFiltersModel(),
    };

    // create root dependencies
    const rootDependencies: RootDependencies = {
      App: defaultDependencies.App,
      useRootViewModel: () => ({
        queryClient,
        services,
        models,
      }),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

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
