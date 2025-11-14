import { render, screen } from "@testing-library/react";
import { App } from "./App.view";
import defaultDependencies, { AppDependencies } from "./App.view.dependencies";
import { ComponentProps } from "react";

describe("App", () => {
  it("Renders correctly", () => {
    // arrange
    const actionsDependencies: ComponentProps<
      AppDependencies["Actions"]
    >["dependencies"] = {
      useActionsViewModel: () => ({
        addTask: vi.fn(),
        users: [],
      }),
    };

    const filtersDependencies: ComponentProps<
      AppDependencies["Filters"]
    >["dependencies"] = {
      useFiltersViewModel: () => ({
        selectedOwnerId: "",
        setSelectedOwnerId: vi.fn(),
        users: [],
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
        tasks: [],
        tasksCount: 0,
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
  });
});
