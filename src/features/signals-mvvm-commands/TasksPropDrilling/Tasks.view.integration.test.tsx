import { QueryClient } from "@tanstack/query-core";
import { render, screen, waitFor } from "@testing-library/react";
import { Tasks, TasksDependencies } from "./Tasks.view";
import { TasksModel, TasksModelDependencies } from "./models/tasks.model";
import { Task, User } from "./types";
import { UsersModel, UsersModelDependencies } from "./models/users.model";
import { SelectedFiltersModel } from "./models/selected-filters.model";
import { createUserModel, UserModelDependencies } from "./models/user.model";
import userEvent from "@testing-library/user-event";
import {
  ActionsViewModelDependencies,
  useActionsViewModel,
} from "./containers/Actions/Actions.view-model";
import {
  FiltersViewModelDependencies,
  useFiltersViewModel,
} from "./containers/Filters/Filters.view-model";
import {
  TaskItem,
  TaskItemDependencies,
} from "./containers/TaskItem/TaskItem.view";
import {
  TaskListViewModelDependencies,
  useTaskListViewModel,
} from "./containers/TaskList/TaskList.view-model";
import {
  TaskItemViewModelDependencies,
  TaskItemViewModelProps,
  useTaskItemViewModel,
} from "./containers/TaskItem/TaskItem.view-model";
import {
  TaskList,
  TaskListDependencies,
} from "./containers/TaskList/TaskList.view";
import {
  Actions,
  ActionsDependencies,
} from "./containers/Actions/Actions.view";
import {
  Filters,
  FiltersDependencies,
} from "./containers/Filters/Filters.view";
import { ComponentProps } from "react";

describe("Tasks Integration (all dependencies explicit)", () => {
  it("should reflect changes in filters in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

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

    // Create tasks model dependencies
    const tasksModelDependencies: TasksModelDependencies = {
      listTasksCommand: async () => mockTasks,
      addTaskCommand: async () => ({
        id: "1",
        text: "task",
        ownerId: "user-1",
      }),
      deleteTaskCommand: async () => {},
    };

    // Create tasks model
    const tasksModel = new TasksModel(queryClient, tasksModelDependencies);

    // Create users model dependencies
    const usersModelDependencies: UsersModelDependencies = {
      listUsersCommand: async () => mockUsers,
    };

    // Create users model
    const usersModel = new UsersModel(queryClient, usersModelDependencies);

    // Create selected filters model
    const selectedFiltersModel = new SelectedFiltersModel();

    // Create dependencies for ActionsViewModel
    const actionsViewModelDependencies: ActionsViewModelDependencies = {
      tasksModel,
      usersModel,
    };

    // Create dependencies for FiltersViewModel
    const filtersViewModelDependencies: FiltersViewModelDependencies = {
      selectedFiltersModel,
      usersModel,
    };

    // Create dependencies for TaskListViewModel
    const taskListViewModelDependencies: TaskListViewModelDependencies = {
      selectedFiltersModel,
      tasksModel,
    };

    // Create dependencies for UserModel
    const userModelDependencies: UserModelDependencies = {
      getUserCommand: async (userId) => {
        return mockUsers.find((user) => user.id === userId);
      },
    };

    // Create dependencies for TaskItemViewModel
    const taskItemViewModelDependencies: TaskItemViewModelDependencies = {
      tasksModel,
      createUserModel: (userId) => {
        return createUserModel(userId, queryClient, userModelDependencies);
      },
    };

    // Create dependencies for TaskItem
    const taskItemDependencies: TaskItemDependencies = {
      useTaskItemViewModel: (props: TaskItemViewModelProps) =>
        useTaskItemViewModel({
          ...props,
          dependencies: taskItemViewModelDependencies,
        }),
    };

    // Create dependencies for TaskList
    const taskListDependencies: TaskListDependencies = {
      TaskItem: (props: ComponentProps<typeof TaskItem>) => (
        <TaskItem {...props} dependencies={taskItemDependencies} />
      ),
      useTaskListViewModel: () =>
        useTaskListViewModel({ dependencies: taskListViewModelDependencies }),
    };

    // Create dependencies for Filters
    const filtersDependencies: FiltersDependencies = {
      useFiltersViewModel: () =>
        useFiltersViewModel({ dependencies: filtersViewModelDependencies }),
    };

    // Create dependencies for Actions
    const actionsDependencies: ActionsDependencies = {
      useActionsViewModel: () =>
        useActionsViewModel({ dependencies: actionsViewModelDependencies }),
    };

    // Create dependencies for Tasks
    const tasksDependencies: TasksDependencies = {
      Actions: () => <Actions dependencies={actionsDependencies} />,
      Filters: () => <Filters dependencies={filtersDependencies} />,
      TaskList: () => <TaskList dependencies={taskListDependencies} />,
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Tasks dependencies={tasksDependencies} />);

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
