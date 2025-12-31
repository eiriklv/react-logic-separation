import { renderHook, act, waitFor } from "@testing-library/react";
import { useTaskItemViewModel } from "./TaskItem.view-model";
import { Task, User } from "../../types";
import { QueryClient } from "@tanstack/query-core";
import defaultDependencies, {
  ModelsDependencies,
  ServicesDependencies,
  TaskItemViewModelDependencies,
} from "./TaskItem.view-model.dependencies";
import { QueryClientProvider } from "@tanstack/react-query";
import { ModelsProvider } from "../../providers/models.provider";
import { ModelsContextInterface } from "../../providers/models.context";
import { ServicesProvider } from "../../providers/services.provider";
import { ServicesContextInterface } from "../../providers/services.context";

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const user: User = {
      id: "user-1",
      name: "John Doe",
      profileImageUrl: "./src/image.png",
    };

    const task: Task = {
      id: "1",
      text: "Buy milk",
      ownerId: "user-1",
    };

    const queryClient = new QueryClient();

    const services: ServicesDependencies = {
      usersService: {
        getUserById: vi.fn<ServicesDependencies["usersService"]["getUserById"]>(
          async () => user,
        ),
      },
    };

    const models: ModelsDependencies = {
      tasksModel: {
        deleteTask: vi.fn(),
      },
    };

    const dependencies: TaskItemViewModelDependencies = {
      createUserModel: defaultDependencies.createUserModel,
      useServices: defaultDependencies.useServices,
      useModels: defaultDependencies.useModels,
      useQueryClient: defaultDependencies.useQueryClient,
    };

    const { result } = renderHook(
      () => useTaskItemViewModel({ dependencies, task }),
      {
        wrapper: ({ children }) => (
          <ModelsProvider models={models as ModelsContextInterface}>
            <ServicesProvider services={services as ServicesContextInterface}>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </ServicesProvider>
          </ModelsProvider>
        ),
      },
    );

    // assert
    await waitFor(() =>
      expect(result.current.user).toEqual({
        id: "user-1",
        name: "John Doe",
        profileImageUrl: "./src/image.png",
      }),
    );

    // call delete handler
    await act(() => result.current.deleteTask());

    // assert
    expect(models.tasksModel.deleteTask).toBeCalledWith(task.id);
  });
});
