import { render, screen } from "@testing-library/react";
import { App } from "./App.view";
import defaultDependencies, { AppDependencies } from "./App.view.dependencies";
import { ComponentProps } from "react";
import { Task, User } from "../../types";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  it("Renders correctly", async () => {
    // arrange
    const mockTasks: Task[] = [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ];

    const mockUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ];

    const addTask = vi.fn();
    const setSelectedOwnerId = vi.fn();

    const actionsDependencies: ComponentProps<
      AppDependencies["Actions"]
    >["dependencies"] = {
      useActionsViewModel: () => ({
        addTask,
        users: mockUsers,
      }),
    };

    const filtersDependencies: ComponentProps<
      AppDependencies["Filters"]
    >["dependencies"] = {
      useFiltersViewModel: () => ({
        selectedOwnerId: "",
        setSelectedOwnerId,
        users: mockUsers,
      }),
    };

    const taskListDependencies: ComponentProps<
      AppDependencies["TaskList"]
    >["dependencies"] = {
      TaskItem: () => <div data-testid="TaskItem" />,
      useTaskListViewModel: () => ({
        isFetching: false,
        isLoading: false,
        isSaving: false,
        tasks: mockTasks,
        tasksCount: mockTasks.length,
      }),
    };

    const appDependencies: AppDependencies = {
      Actions: () => (
        <defaultDependencies.Actions dependencies={actionsDependencies} />
      ),
      Filters: () => (
        <defaultDependencies.Filters dependencies={filtersDependencies} />
      ),
      TaskList: () => (
        <defaultDependencies.TaskList dependencies={taskListDependencies} />
      ),
    };

    render(<App dependencies={appDependencies} />);

    // assert
    expect(screen.getByText(/Actions/)).toBeInTheDocument();
    expect(screen.getByText(/Filters/)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/)).toBeInTheDocument();

    // assert
    expect(screen.getAllByTestId("TaskItem")).toHaveLength(4);

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "User 1",
    );

    // assert
    expect(setSelectedOwnerId).toHaveBeenCalledWith("user-1");

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "User 2",
    );

    // assert
    expect(setSelectedOwnerId).toHaveBeenCalledWith("user-2");

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "All",
    );

    // assert
    expect(setSelectedOwnerId).toHaveBeenCalledWith("");
  });
});
