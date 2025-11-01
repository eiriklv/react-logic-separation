import { renderHook } from "@testing-library/react";
import { useAppViewModel } from "./App.view-model";
import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { ITasksModel } from "../../models/tasks.model";
import { IUsersModel } from "../../models/users.model";
import { AppViewModelDependencies } from "./App.view-model.dependencies";
import { createQueryClient } from "../../utils/create-query-client";
import { ServicesContextInterface } from "../../providers/services.provider";
import { CommandsContextInterface } from "../../providers/commands.provider";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./App.view-model.dependencies", () => ({ default: {} }));

describe("useAppViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = createQueryClient();
    const services = {} as ServicesContextInterface;
    const commands = {} as CommandsContextInterface;

    const selectedFiltersModel = {} as ISelectedFiltersModel;
    const tasksModel = {} as ITasksModel;
    const usersModel = {} as IUsersModel;

    const dependencies: AppViewModelDependencies = {
      createSelectedFiltersModel: vi.fn(() => selectedFiltersModel),
      createTasksModel: vi.fn(() => tasksModel),
      createUsersModel: vi.fn(() => usersModel),
      useQueryClient: vi.fn(() => queryClient),
      useCommands: vi.fn(() => commands),
      useServices: vi.fn(() => services),
    };

    const { result } = renderHook(() => useAppViewModel({ dependencies }));

    expect(result.current).toEqual({
      models: {
        selectedFiltersModel,
        tasksModel,
        usersModel,
      },
    });
  });
});
