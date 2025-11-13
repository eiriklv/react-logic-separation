import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Actions } from "./Actions.view";
import defaultDependencies, {
  ActionsDependencies,
} from "./Actions.view.dependencies";
import { ActionsViewModelDependencies } from "./Actions.view-model.dependencies";
import { signal } from "@preact/signals-core";

describe("Actions Component", () => {
  it("Calls the correct handler when adding a task", async () => {
    // arrange
    const addTask = vi.fn();

    const actionsViewModelDependencies: ActionsViewModelDependencies = {
      useModels: vi.fn<ActionsViewModelDependencies["useModels"]>(() => ({
        tasksModel: {
          addTask,
        },
        usersModel: {
          users: signal([
            {
              id: "user-1",
              name: "John Doe",
              profileImageUrl: "./src/test.png",
            },
          ]),
        },
      })),
    };

    const actionsDependencies: ActionsDependencies = {
      useActionsViewModel: vi.fn<ActionsDependencies["useActionsViewModel"]>(
        (props) =>
          defaultDependencies.useActionsViewModel({
            dependencies: actionsViewModelDependencies,
            ...props,
          }),
      ),
    };

    // act
    render(<Actions dependencies={actionsDependencies} />);

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
