import { renderHook } from "@testing-library/react";
import { useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";
import type { RootViewModelDependencies } from "./Root.view-model.dependencies";
import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { ITasksModel } from "../../models/tasks.model";
import { IUsersModel } from "../../models/users.model";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Root.view-model.dependencies", () => ({ default: {} }));

describe("useRootViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = new QueryClient();
    const tasksService = {} as ITasksService;
    const usersService = {} as IUsersService;
    const selectedFiltersModel = {} as ISelectedFiltersModel;
    const tasksModel = {} as ITasksModel;
    const usersModel = {} as IUsersModel;

    const dependencies: RootViewModelDependencies = {
      createQueryClient: vi.fn(() => queryClient),
      createTasksService: vi.fn(() => tasksService),
      createUsersService: vi.fn(() => usersService),
      createSelectedFiltersModel: vi.fn(() => selectedFiltersModel),
      createTasksModel: vi.fn(() => tasksModel),
      createUsersModel: vi.fn(() => usersModel),
    };

    const { result } = renderHook(() => useRootViewModel({ dependencies }));

    expect(result.current).toEqual({
      services: {
        tasksService,
        usersService,
      },
      models: {
        selectedFiltersModel,
        tasksModel,
        usersModel,
      },
      queryClient,
    });
  });
});
