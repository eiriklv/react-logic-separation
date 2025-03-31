import { render, screen } from "@testing-library/react";
import { TasksDependencies, Tasks } from "./Tasks.view";

describe("Tasks", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TasksDependencies = {
      Actions: () => <>Actions</>,
      Filters: () => <>Filters</>,
      TaskList: () => <>TaskList</>,
    };

    render(<Tasks dependencies={dependencies} />);

    // assert
    expect(screen.getByText(/Actions/)).toBeInTheDocument();
    expect(screen.getByText(/Filters/)).toBeInTheDocument();
    expect(screen.getByText(/TaskList/)).toBeInTheDocument();
  });
});
