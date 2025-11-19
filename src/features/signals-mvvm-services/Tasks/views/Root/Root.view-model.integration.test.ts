import { renderHook, waitFor } from "@testing-library/react";
import { useRootViewModel } from "./Root.view-model";
import type { RootViewModelDependencies } from "./Root.view-model.dependencies";
import defaultDependencies from "./Root.view-model.dependencies";
import { SdkDependencies as TasksServiceSdkDependencies } from "../../services/tasks.service";
import { TasksServiceDependencies } from "../../services/tasks.service.dependencies";
import { SdkDependencies as UsersServiceSdkDependencies } from "../../services/users.service";
import { TasksModelDependencies } from "../../models/tasks.model";
import { UsersModelDependencies } from "../../models/users.model";
import { Task, User } from "../../types";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const defaultHandlers = [];
export const server = setupServer(...defaultHandlers);

describe("useRootViewModel (shallow)", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockUsers: User[] = [];
    const mockTasks: Task[] = [];

    const baseUrl = "https://test.test";

    const tasksServiceSdkDependencies: TasksServiceSdkDependencies = {
      deleteTask: vi.fn(),
      listTasks: vi.fn(async () => mockTasks),
      upsertTask: vi.fn(),
    };

    const tasksServiceDependencies: TasksServiceDependencies = {
      generateId: vi.fn(() => "test-id"),
    };

    const usersServiceSdkDependencies: UsersServiceSdkDependencies = {
      listUsers: vi.fn(async () => mockUsers),
      retrieveUserById: vi.fn(),
    };

    const tasksModelDependencies: TasksModelDependencies = {
      tasksService: {
        addTask: vi.fn(),
        deleteTask: vi.fn(),
        listTasks: vi.fn(async () => mockTasks),
      },
    };

    const usersModelDependencies: UsersModelDependencies = {
      usersService: {
        listUsers: vi.fn(async () => []),
      },
    };

    const queryClient = defaultDependencies.createQueryClient();

    const dependencies: RootViewModelDependencies = {
      baseUrl,
      createSdk: defaultDependencies.createSdk,
      createQueryClient: () => queryClient,
      createTasksService: () =>
        defaultDependencies.createTasksService(
          tasksServiceSdkDependencies,
          tasksServiceDependencies,
        ),
      createUsersService: () =>
        defaultDependencies.createUsersService(usersServiceSdkDependencies),
      createSelectedFiltersModel:
        defaultDependencies.createSelectedFiltersModel,
      createTasksModel: (queryClient) =>
        defaultDependencies.createTasksModel(
          queryClient,
          tasksModelDependencies,
        ),
      createUsersModel: (queryClient) =>
        defaultDependencies.createUsersModel(
          queryClient,
          usersModelDependencies,
        ),
    };

    const { result } = renderHook(() => useRootViewModel({ dependencies }));

    expect(result.current.queryClient).toEqual(queryClient);

    /**
     * Perform assertions on the models
     */
    await waitFor(() =>
      expect(result.current.models.tasksModel.tasks.value).toEqual(mockTasks),
    );

    await waitFor(() =>
      expect(result.current.models.usersModel.users.value).toEqual(mockUsers),
    );

    /**
     * Perform assertions on the services
     */
    await waitFor(async () =>
      expect(await result.current.services.tasksService.listTasks()).toEqual(
        mockTasks,
      ),
    );

    await waitFor(async () =>
      expect(await result.current.services.usersService.listUsers()).toEqual(
        mockUsers,
      ),
    );
  });
});

describe("useRootViewModel (deep)", () => {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: "error",
    }),
  );
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "/src/user-1.jpg" },
      { id: "user-2", name: "User 2", profileImageUrl: "/src/user-2.jpg" },
    ];
    const mockTasks: Task[] = [
      { id: "task-1", ownerId: "user-1", text: "Task 1" },
      { id: "task-2", ownerId: "user-2", text: "Task 2" },
    ];

    server.use(
      http.get(`${defaultDependencies.baseUrl}/api/users`, () => {
        return HttpResponse.json<User[]>(mockUsers);
      }),
    );

    server.use(
      http.get(`${defaultDependencies.baseUrl}/api/tasks`, () => {
        return HttpResponse.json<Task[]>(mockTasks);
      }),
    );

    const dependencies: RootViewModelDependencies = {
      baseUrl: defaultDependencies.baseUrl,
      createSdk: defaultDependencies.createSdk,
      createQueryClient: defaultDependencies.createQueryClient,
      createTasksService: defaultDependencies.createTasksService,
      createUsersService: defaultDependencies.createUsersService,
      createSelectedFiltersModel:
        defaultDependencies.createSelectedFiltersModel,
      createTasksModel: defaultDependencies.createTasksModel,
      createUsersModel: defaultDependencies.createUsersModel,
    };

    const { result } = renderHook(() => useRootViewModel({ dependencies }));

    /**
     * Perform assertions on the models
     */
    await waitFor(() =>
      expect(result.current.models.tasksModel.tasks.value).toEqual(mockTasks),
    );

    await waitFor(() =>
      expect(result.current.models.usersModel.users.value).toEqual(mockUsers),
    );

    /**
     * Perform assertions on the services
     */
    await waitFor(async () =>
      expect(await result.current.services.tasksService.listTasks()).toEqual(
        mockTasks,
      ),
    );

    await waitFor(async () =>
      expect(await result.current.services.usersService.listUsers()).toEqual(
        mockUsers,
      ),
    );
  });
});
