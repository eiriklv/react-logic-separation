import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Actions } from "./Actions.view";
import { ActionsContext } from "./Actions.view.context";
import { ActionsDependencies } from "./Actions.view.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Actions.view.dependencies", () => ({ default: {} }));

describe("Actions Component", () => {
  it("Renders correctly", () => {
    // arrange
    const mockDependencies: ActionsDependencies = {
      useActionsViewModel: vi.fn(() => ({
        users: [],
        addTask: vi.fn(),
      })),
    };

    render(
      <ActionsContext.Provider value={mockDependencies}>
        <Actions />
      </ActionsContext.Provider>,
    );

    // assert
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("Calls the correct handler when adding a task", async () => {
    // arrange
    const addTask = vi.fn();
    const mockDependencies: ActionsDependencies = {
      useActionsViewModel: vi.fn(() => ({
        users: [
          {
            id: "user-1",
            name: "John Doe",
            profileImageUrl: "./src/test.png",
          },
        ],
        addTask,
      })),
    };

    // act
    render(
      <ActionsContext.Provider value={mockDependencies}>
        <Actions />
      </ActionsContext.Provider>,
    );

    // assert
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // act
    await userEvent.type(screen.getByLabelText("Add task"), "Paint house");
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "User:" }),
      "John Doe",
    );
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    // assert
    expect(addTask).toHaveBeenCalledWith("Paint house", "user-1");
  });
});
