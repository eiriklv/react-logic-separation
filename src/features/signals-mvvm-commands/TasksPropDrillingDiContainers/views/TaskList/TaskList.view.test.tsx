import { render, screen } from "@testing-library/react";
import { TaskList } from "./TaskList.view";
import { TaskListDependencies } from "./TaskList.view";

describe("TaskList Component", () => {
  it("Renders correctly when loading", () => {
    // arrange
    const dependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn(() => ({
        tasks: [],
        tasksCount: 0,
        isLoading: true,
        isFetching: false,
        isSaving: false,
        addTask: vi.fn(),
      })),
      TaskItem: () => <></>,
    };

    render(<TaskList dependencies={dependencies} />);

    // assert
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it("Renders correctly when saving and refetching", () => {
    // arrange
    const dependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn(() => ({
        tasks: [],
        tasksCount: 0,
        isLoading: false,
        isFetching: true,
        isSaving: true,
        addTask: vi.fn(),
      })),
      TaskItem: () => <></>,
    };

    render(<TaskList dependencies={dependencies} />);

    // assert
    expect(screen.getByText(/saving/)).toBeInTheDocument();
    expect(screen.getByText(/wait/)).toBeInTheDocument();
  });

  it("Renders correctly with no tasks", () => {
    // arrange
    const dependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn(() => ({
        tasks: [],
        tasksCount: 0,
        isLoading: false,
        isFetching: false,
        isSaving: false,
        addTask: vi.fn(),
      })),
      TaskItem: () => <></>,
    };

    render(<TaskList dependencies={dependencies} />);

    // assert
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });

  it("Renders correctly with multiple tasks", () => {
    // arrange
    const dependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn(() => ({
        tasks: [
          {
            id: "1",
            text: "Task 1",
            ownerId: "user-1",
          },
          {
            id: "2",
            text: "Task 2",
            ownerId: "user-1",
          },
        ],
        tasksCount: 2,
        isLoading: false,
        isFetching: false,
        isSaving: false,
        addTask: vi.fn(),
      })),
      TaskItem: () => <div>TaskItem</div>,
    };

    render(<TaskList dependencies={dependencies} />);

    // assert
    expect(screen.getAllByText("TaskItem").length).toEqual(2);
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});
