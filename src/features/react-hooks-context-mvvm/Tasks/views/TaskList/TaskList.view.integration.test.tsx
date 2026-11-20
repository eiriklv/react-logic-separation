import { render, screen } from "@testing-library/react";
import { TaskList } from "./TaskList.view";
import defaultDependencies, {
  TaskListDependencies,
} from "./TaskList.view.dependencies";
import {
  ModelsDependencies,
  TaskListViewModelDependencies,
} from "./TaskList.view-model.dependencies";
import { Task } from "../../types";
import { TaskItemDependencies } from "../TaskItem/TaskItem.view.dependencies";

describe("TaskList Component", () => {
  it("Renders correctly when loading", () => {
    // arrange
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    const models: ModelsDependencies = {
      tasksModel: {
        useTasksByOwnerId: vi.fn(() => mockTaskList),
        useTasksCountByOwnerId: vi.fn(() => mockTaskListCount),
        isFetching: false,
        isLoading: true,
        isSaving: false,
      },
      selectedFiltersModel: {
        selectedOwnerId: "",
        setSelectedOwnerId: vi.fn(),
      },
    };

    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      useModels: () => models,
    };

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: () => ({
        deleteTask: vi.fn(),
        user: {
          id: "user-1",
          name: "Test",
          profileImageUrl: "https://image.url",
        },
      }),
    };

    const taskListDependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn<TaskListDependencies["useTaskListViewModel"]>(
        (props) =>
          defaultDependencies.useTaskListViewModel({
            dependencies: taskListViewModelDependencies,
            ...props,
          }),
      ),
      TaskItem: vi.fn<TaskListDependencies["TaskItem"]>((props) => (
        <defaultDependencies.TaskItem
          {...props}
          dependencies={taskItemDependencies}
        />
      )),
    };

    render(<TaskList dependencies={taskListDependencies} />);

    // assert
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it("Renders correctly when saving and refetching", () => {
    // arrange
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    const models: ModelsDependencies = {
      tasksModel: {
        useTasksByOwnerId: vi.fn(() => mockTaskList),
        useTasksCountByOwnerId: vi.fn(() => mockTaskListCount),
        isFetching: true,
        isLoading: false,
        isSaving: true,
      },
      selectedFiltersModel: {
        selectedOwnerId: "",
        setSelectedOwnerId: vi.fn(),
      },
    };

    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      useModels: () => models,
    };

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: () => ({
        deleteTask: vi.fn(),
        user: {
          id: "user-1",
          name: "Test",
          profileImageUrl: "https://image.url",
        },
      }),
    };

    const taskListDependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn<TaskListDependencies["useTaskListViewModel"]>(
        (props) =>
          defaultDependencies.useTaskListViewModel({
            dependencies: taskListViewModelDependencies,
            ...props,
          }),
      ),
      TaskItem: vi.fn<TaskListDependencies["TaskItem"]>((props) => (
        <defaultDependencies.TaskItem
          {...props}
          dependencies={taskItemDependencies}
        />
      )),
    };

    render(<TaskList dependencies={taskListDependencies} />);

    // assert
    expect(screen.getByText(/saving/)).toBeInTheDocument();
    expect(screen.getByText(/wait/)).toBeInTheDocument();
  });

  it("Renders correctly with no tasks", () => {
    // arrange
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    const models: ModelsDependencies = {
      tasksModel: {
        useTasksByOwnerId: vi.fn(() => mockTaskList),
        useTasksCountByOwnerId: vi.fn(() => mockTaskListCount),
        isFetching: false,
        isLoading: false,
        isSaving: false,
      },
      selectedFiltersModel: {
        selectedOwnerId: "",
        setSelectedOwnerId: vi.fn(),
      },
    };

    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      useModels: () => models,
    };

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: () => ({
        deleteTask: vi.fn(),
        user: {
          id: "user-1",
          name: "Test",
          profileImageUrl: "https://image.url",
        },
      }),
    };

    const taskListDependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn<TaskListDependencies["useTaskListViewModel"]>(
        (props) =>
          defaultDependencies.useTaskListViewModel({
            dependencies: taskListViewModelDependencies,
            ...props,
          }),
      ),
      TaskItem: vi.fn<TaskListDependencies["TaskItem"]>((props) => (
        <defaultDependencies.TaskItem
          {...props}
          dependencies={taskItemDependencies}
        />
      )),
    };

    render(<TaskList dependencies={taskListDependencies} />);

    // assert
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });

  it("Renders correctly with multiple tasks", () => {
    // arrange
    const mockTaskList: Task[] = [
      {
        id: "1",
        text: "First task",
        ownerId: "user-1",
      },
      {
        id: "2",
        text: "Second task",
        ownerId: "user-1",
      },
    ];
    const mockTaskListCount = 2;

    const models: ModelsDependencies = {
      tasksModel: {
        useTasksByOwnerId: vi.fn(() => mockTaskList),
        useTasksCountByOwnerId: vi.fn(() => mockTaskListCount),
        isFetching: false,
        isLoading: false,
        isSaving: false,
      },
      selectedFiltersModel: {
        selectedOwnerId: "",
        setSelectedOwnerId: vi.fn(),
      },
    };

    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      useModels: () => models,
    };

    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: () => ({
        deleteTask: vi.fn(),
        user: {
          id: "user-1",
          name: "Test",
          profileImageUrl: "https://image.url",
        },
      }),
    };

    const taskListDependencies: TaskListDependencies = {
      useTaskListViewModel: vi.fn<TaskListDependencies["useTaskListViewModel"]>(
        (props) =>
          defaultDependencies.useTaskListViewModel({
            dependencies: taskListViewModelDependencies,
            ...props,
          }),
      ),
      TaskItem: vi.fn<TaskListDependencies["TaskItem"]>((props) => (
        <defaultDependencies.TaskItem
          {...props}
          dependencies={taskItemDependencies}
        />
      )),
    };

    render(<TaskList dependencies={taskListDependencies} />);

    // assert
    expect(screen.getByText(/First task/)).toBeInTheDocument();
    expect(screen.getByText(/Second task/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});
