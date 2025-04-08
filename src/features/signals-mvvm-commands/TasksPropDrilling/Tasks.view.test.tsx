import { render, screen } from "@testing-library/react";
import { TasksDependencies, Tasks } from "./Tasks.view";

describe("Tasks", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TasksDependencies = {
      Actions: () => <div data-testid="Actions" />,
      Filters: () => <div data-testid="Filters" />,
      TaskList: () => <div data-testid="TaskList" />,
    };

    render(<Tasks dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("Actions")).toBeInTheDocument();
    expect(screen.getByTestId("Filters")).toBeInTheDocument();
    expect(screen.getByTestId("TaskList")).toBeInTheDocument();
  });
});
