import { render, screen } from "@testing-library/react";
import { TaskItem } from "./TaskItem.view";
import { Task } from "../../types";
import { TaskItemContext } from "./TaskItem.view.context";
import userEvent from "@testing-library/user-event";
import { TaskItemDependencies } from "./TaskItem.view.dependencies";

/**
 * Remove default dependencies to avoid unnecessary collect-time
 * and other side-effects caused from importing them
 */
vi.mock("./TaskItem.view.dependencies", () => ({ default: {} }));

describe("TaskItem", () => {
  it("Renders correctly when user is loaded", () => {
    // arrange
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
        deleteTask: vi.fn(),
      }),
    };

    render(
      <TaskItemContext.Provider value={taskItemDependencies}>
        <TaskItem task={task} />
      </TaskItemContext.Provider>,
    );

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

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: () => ({
        user: undefined,
        deleteTask: vi.fn(),
      }),
    };

    render(
      <TaskItemContext.Provider value={taskItemDependencies}>
        <TaskItem task={task} />
      </TaskItemContext.Provider>,
    );

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

    render(
      <TaskItemContext.Provider value={taskItemDependencies}>
        <TaskItem task={task} />
      </TaskItemContext.Provider>,
    );

    // act
    await userEvent.click(screen.getByRole("button", { name: "X" }));

    // assert
    expect(deleteTask).toHaveBeenCalledOnce();
  });
});
