import { render, screen } from "@testing-library/react";
import { CategorizedReminders } from "./CategorizedReminders.view";
import {
  CategorizedRemindersContext,
  CategorizedRemindersContextInterface,
} from "./CategorizedReminders.view.context";
import { SelectedCategoryModel } from "./models/selected-category.model";
import { RemindersModel } from "./models/reminders.model";

describe("CategorizedReminders Component", () => {
  it("Renders correctly", () => {
    // arrange
    const selectedCategoryModel = {} as SelectedCategoryModel;
    const remindersModel = {} as RemindersModel;

    const dependencies: CategorizedRemindersContextInterface = {
      useCategorizedRemindersViewModel: () => ({
        categorySidebarViewModelDependencies: {
          selectedCategoryModel,
          remindersModel,
        },
        remindersViewModelDependencies: {
          selectedCategoryModel,
          remindersModel,
        },
        topbarViewModelDependencies: {
          selectedCategoryModel,
          remindersModel,
        },
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
