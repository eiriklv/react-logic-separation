import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Task, User } from "../../types";
import { ServicesContextInterface } from "../../providers/services.provider";
import { ModelsContextInterface } from "../../providers/models.provider";
import { Root } from "./Root.view";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import rootViewModelDefaultDependencies from "./Root.view-model.dependencies";
import { createTasksServiceMock } from "../../services/tasks.service.mock";
import { createUsersServiceMock } from "../../services/users.service.mock";

describe("Root Integration (view-model layer services)", () => {
  it("should reflect changes when deleting a task in all applicable views", async () => {
    // create mock tasks
    const mockTasks: Task[] = [
      { id: "task-1", ownerId: "user-1", text: "Paint house" },
    ];

    // create mock tasks service
    const tasksService = createTasksServiceMock(undefined, {
      initialTasks: mockTasks,
    });

    // create mock users
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

    // create mock users service
    const usersService = createUsersServiceMock(undefined, {
      initialUsers: mockUsers,
    });

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
    const tasksService = createTasksServiceMock(undefined, {
      initialTasks: mockTasks,
    });

    // create mock users
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

    // create mock users service
    const usersService = createUsersServiceMock(undefined, {
      initialUsers: mockUsers,
    });

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
    const tasksService = createTasksServiceMock(undefined, {
      initialTasks: mockTasks,
    });

    // create mock users
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

    // create mock users service
    const usersService = createUsersServiceMock(undefined, {
      initialUsers: mockUsers,
    });

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
    const queryClient = rootViewModelDefaultDependencies.createQueryClient();

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
      tasksService: createTasksServiceMock(undefined, {
        initialTasks: mockTasks,
      }),
      usersService: createUsersServiceMock(undefined, {
        initialUsers: mockUsers,
      }),
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
