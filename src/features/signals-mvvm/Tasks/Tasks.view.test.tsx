import { render, screen } from "@testing-library/react";
import { Tasks } from "./Tasks.view";
import { TasksContext, TasksContextInterface } from "./Tasks.view.context";

describe("Tasks", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TasksContextInterface = {
      Actions: () => <>Actions</>,
      Filters: () => <>Filters</>,
      TaskList: () => <>TaskList</>,
    };

    render(
      <TasksContext.Provider value={dependencies}>
        <Tasks />
      </TasksContext.Provider>,
    );

    // assert
    expect(screen.getByText(/Actions/)).toBeInTheDocument();
    expect(screen.getByText(/Filters/)).toBeInTheDocument();
    expect(screen.getByText(/TaskList/)).toBeInTheDocument();
  });
});
