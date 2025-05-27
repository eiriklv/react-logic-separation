import { renderHook } from "@testing-library/react";
import { CommandsDependencies, useAppViewModel } from "./App.view-model";
import { AppViewModelContext } from "./App.view-model.context";
import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { ITasksModel } from "../../models/tasks.model";
import { IUsersModel } from "../../models/users.model";
import { QueryClientProvider } from "@tanstack/react-query";
import { CommandsContext } from "../../providers/commands.provider";
import { createQueryClient } from "../../utils/create-query-client";
import { AppViewModelDependencies } from "./App.view-model.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./App.view-model.dependencies", () => ({ default: {} }));

describe("useAppViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = createQueryClient();

    const selectedFiltersModel = {} as ISelectedFiltersModel;
    const tasksModel = {} as ITasksModel;
    const usersModel = {} as IUsersModel;

    const dependencies: AppViewModelDependencies = {
      createSelectedFiltersModel: vi.fn(() => selectedFiltersModel),
      createTasksModel: vi.fn(() => tasksModel),
      createUsersModel: vi.fn(() => usersModel),
    };

    const commands: CommandsDependencies = {
      addTaskCommand: vi.fn(),
      deleteTaskCommand: vi.fn(),
      listTasksCommand: vi.fn(),
      listUsersCommand: vi.fn(),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <CommandsContext.Provider value={commands}>
          <AppViewModelContext.Provider value={dependencies}>
            {children}
          </AppViewModelContext.Provider>
        </CommandsContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useAppViewModel(), { wrapper });

    expect(result.current).toEqual({
      models: {
        selectedFiltersModel,
        tasksModel,
        usersModel,
      },
    });
  });
});
