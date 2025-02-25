import { render, screen } from "@testing-library/react";
import { CategorizedReminders } from "./CategorizedReminders";
import {
  CategorizedRemindersContext,
  CategorizedRemindersContextInterface,
} from "./CategorizedReminders.context";
import { SelectedCategoryModel } from "./models/selected-category-model";

describe("CategorizedReminders Component", () => {
  it("Renders correctly", () => {
    // arrange
    const selectedCategoryModel = {} as SelectedCategoryModel;

    const dependencies: CategorizedRemindersContextInterface = {
      useCategorizedRemindersViewModel: () => ({
        selectedCategoryModel,
      }),
      Topbar: () => <>Topbar</>,
      CategorySidebar: () => <>CategorySidebar</>,
      Reminders: () => <>Reminders</>,
    };

    render(
      <CategorizedRemindersContext.Provider value={dependencies}>
        <CategorizedReminders />
      </CategorizedRemindersContext.Provider>,
    );

    // assert
    expect(screen.getByText(/Topbar/)).toBeInTheDocument();
    expect(screen.getByText(/CategorySidebar/)).toBeInTheDocument();
    expect(screen.getByText(/Reminders/)).toBeInTheDocument();
  });
});
