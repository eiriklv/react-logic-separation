import { render, screen } from "@testing-library/react";
import { TaskItem } from "./TaskItem.view";
import { Task } from "../../types";
import userEvent from "@testing-library/user-event";
import defaultDependencies, {
  TaskItemDependencies,
} from "./TaskItem.view.dependencies";
import { signal } from "@preact/signals-core";
import { QueryClient } from "@tanstack/query-core";

describe("TaskItem", () => {
  it("Renders correctly when user is loaded", () => {
    // arrange
    const task: Task = {
      id: "test",
      text: "Write self reflection",
      ownerId: "user-1",
    };

    const userModel: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["createUserModel"]
    > = {
      user: signal({
        id: "user-1",
        name: "John Doe",
        profileImageUrl: "./src/profile.png",
      }),
    };

    const models: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["useModels"]
    > = {
      tasksModel: {
        deleteTask: vi.fn(),
      },
    };

    const services: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["useServices"]
    > = {
      usersService: {
        getUserById: vi.fn(),
      },
    };

    const queryClient: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["useQueryClient"]
    > = new QueryClient();

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: (props) =>
        defaultDependencies.useTaskItemViewModel({
          ...props,
          dependencies: {
            createUserModel: () => userModel,
            useModels: () => models,
            useQueryClient: () => queryClient,
            useServices: () => services,
          },
        }),
    };

    render(<TaskItem dependencies={taskItemDependencies} task={task} />);

    // assert
    expect(screen.getByText(/Write self reflection/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it("Renders correctly when loading", () => {
    // arrange
    const task: Task = {
      id: "test",
      text: "Write self reflection",
      ownerId: "user-1",
    };

    const userModel: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["createUserModel"]
    > = {
      user: signal(undefined),
    };

    const models: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["useModels"]
    > = {
      tasksModel: {
        deleteTask: vi.fn(),
      },
    };

    const services: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["useServices"]
    > = {
      usersService: {
        getUserById: vi.fn(),
      },
    };

    const queryClient: ReturnType<
      NonNullable<
        Parameters<
          TaskItemDependencies["useTaskItemViewModel"]
        >[0]["dependencies"]
      >["useQueryClient"]
    > = new QueryClient();

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: (props) =>
        defaultDependencies.useTaskItemViewModel({
          ...props,
          dependencies: {
            createUserModel: () => userModel,
            useModels: () => models,
            useQueryClient: () => queryClient,
            useServices: () => services,
          },
        }),
    };

    render(<TaskItem dependencies={taskItemDependencies} task={task} />);

    // assert
    expect(screen.getByText(/Write self reflection/)).toBeInTheDocument();
    expect(screen.getByText(/loading user/)).toBeInTheDocument();
  });

  it("Calls delete handler with correct arguments", async () => {
    // arrange
    const deleteTask = vi.fn();

    const task: Task = {
      id: "test",
      text: "Write self reflection",
      ownerId: "user-1",
    };

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: () => ({
        user: {
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/profile.png",
        },
        deleteTask,
      }),
    };

    render(<TaskItem dependencies={taskItemDependencies} task={task} />);

    // act
    await userEvent.click(screen.getByRole("button", { name: "X" }));

    // assert
    expect(deleteTask).toHaveBeenCalledOnce();
  });
});
