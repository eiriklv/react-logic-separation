import { render, screen } from "@testing-library/react";
import { Tasks } from "./Tasks.view";
import { TasksContext, TasksContextInterface } from "./Tasks.view.context";

describe("Tasks", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TasksContextInterface = {
      Actions: () => <div data-testid="Actions" />,
      Filters: () => <div data-testid="Filters" />,
      TaskList: () => <div data-testid="TaskList" />,
    };

    render(
      <TasksContext.Provider value={dependencies}>
        <Tasks />
      </TasksContext.Provider>,
    );

    // assert
    expect(screen.getByTestId("Actions")).toBeInTheDocument();
    expect(screen.getByTestId("Filters")).toBeInTheDocument();
    expect(screen.getByTestId("TaskList")).toBeInTheDocument();
  });
});
