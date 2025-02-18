import { render, screen } from "@testing-library/react";
import { CategorizedReminders } from "./CategorizedReminders";
import {
  CategorizedRemindersContext,
  CategorizedRemindersContextInterface,
} from "./CategorizedReminders.context";
import { Topbar } from "./containers/Topbar/Topbar";
import { CategorySidebar } from "./containers/CategorySidebar/CategorySidebar";
import { Reminders } from "./containers/Reminders/Reminders";
import {
  TopbarContext,
  TopbarContextInterface,
} from "./containers/Topbar/Topbar.context";
import { useTopbarViewModel } from "./containers/Topbar/Topbar.viewmodel";
import {
  TopbarViewModelContext,
  TopbarViewModelContextInterface,
} from "./containers/Topbar/Topbar.viewmodel.context";
import { SelectedCategoryModel } from "./models/selected-category-model";
import { RemindersModel } from "./models/reminders-model";
import { QueryClient } from "@tanstack/query-core";
import { Reminder } from "./types";
import {
  CategorySidebarContext,
  CategorySidebarContextInterface,
} from "./containers/CategorySidebar/CategorySidebar.context";
import { useCategorySidebarViewModel } from "./containers/CategorySidebar/CategorySidebar.viewmodel";
import {
  CategorySidebarViewModelContext,
  CategorySidebarViewModelContextInterface,
} from "./containers/CategorySidebar/CategorySidebar.viewmodel.context";
import { QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import {
  RemindersContext,
  RemindersContextInterface,
} from "./containers/Reminders/Reminders.context";
import { RemindersViewModelContextInterface } from "./containers/Reminders/Reminders.viewmodel.context";
import { useRemindersViewModel } from "./containers/Reminders/Reminders.viewmodel";
import { RemindersViewModelContext } from "./containers/Reminders/Reminders.viewmodel.context";
import { ReminderItem } from "./components/ReminderItem";

describe("CategorizedReminders Integration", () => {
  it("should reflect changes in category in all applicable views", async () => {
    // arrange
    const queryClient = new QueryClient();

    const mockReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    const remindersModel: RemindersModel = new RemindersModel(queryClient, {
      remindersService: {
        fetchReminders: vi.fn(async () => mockReminders),
        addReminder: vi.fn(),
      },
    });

    const selectedCategoryModel: SelectedCategoryModel =
      new SelectedCategoryModel();

    const topbarDependencies: TopbarContextInterface = {
      useTopbarViewModel: useTopbarViewModel,
    };

    const topbarViewModelDependencies: TopbarViewModelContextInterface = {
      remindersModel,
      selectedCategoryModel,
    };

    const categorySidebarDependencies: CategorySidebarContextInterface = {
      useCategorySidebarViewModel: useCategorySidebarViewModel,
    };

    const categorySidebarViewModelDependencies: CategorySidebarViewModelContextInterface =
      {
        remindersModel,
        selectedCategoryModel,
      };

    const categorizedRemindersDependencies: CategorizedRemindersContextInterface =
      {
        Topbar: Topbar,
        CategorySidebar: CategorySidebar,
        Reminders: Reminders,
      };

    const remindersDependencies: RemindersContextInterface = {
      useRemindersViewModel: useRemindersViewModel,
      ReminderItem: ReminderItem,
    };

    const remindersViewModelDependencies: RemindersViewModelContextInterface = {
      remindersModel,
      selectedCategoryModel,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <TopbarViewModelContext.Provider value={topbarViewModelDependencies}>
          <CategorySidebarViewModelContext.Provider
            value={categorySidebarViewModelDependencies}
          >
            <RemindersViewModelContext.Provider
              value={remindersViewModelDependencies}
            >
              <TopbarContext.Provider value={topbarDependencies}>
                <CategorySidebarContext.Provider
                  value={categorySidebarDependencies}
                >
                  <RemindersContext.Provider value={remindersDependencies}>
                    <CategorizedRemindersContext.Provider
                      value={categorizedRemindersDependencies}
                    >
                      <CategorizedReminders />
                    </CategorizedRemindersContext.Provider>
                  </RemindersContext.Provider>
                </CategorySidebarContext.Provider>
              </TopbarContext.Provider>
            </RemindersViewModelContext.Provider>
          </CategorySidebarViewModelContext.Provider>
        </TopbarViewModelContext.Provider>
      </QueryClientProvider>,
    );

    // set the category via the topbar
    await userEvent.type(
      screen.getByLabelText("Selected category:"),
      "category-1",
    );

    // check that everything is reflected correctly
    expect(selectedCategoryModel.selectedCategory.value).toEqual("category-1");
    expect(screen.getByRole("link", { name: "category-1" })).toHaveStyle(
      "font-weight: bold",
    );
    expect(screen.getByLabelText("Selected category:")).toHaveValue(
      "category-1",
    );
    expect(screen.getByText(/Reminder 1/)).toBeInTheDocument();
    expect(screen.getByText(/Reminder 2/)).toBeInTheDocument();
    expect(screen.queryByText(/Reminder 3/)).toBeNull();
    expect(screen.queryByText(/Reminder 4/)).toBeNull();

    // set the category via the topbar
    await userEvent.clear(screen.getByLabelText("Selected category:"));
    await userEvent.type(
      screen.getByLabelText("Selected category:"),
      "category-2",
    );

    // check that everything is reflected correctly
    expect(selectedCategoryModel.selectedCategory.value).toEqual("category-2");
    expect(screen.getByRole("link", { name: "category-2" })).toHaveStyle(
      "font-weight: bold",
    );
    expect(screen.getByLabelText("Selected category:")).toHaveValue(
      "category-2",
    );
    expect(screen.queryByText(/Reminder 1/)).toBeNull();
    expect(screen.queryByText(/Reminder 2/)).toBeNull();
    expect(screen.getByText(/Reminder 3/)).toBeInTheDocument();
    expect(screen.getByText(/Reminder 4/)).toBeInTheDocument();

    // set the category via the sidebar
    await userEvent.click(screen.getByRole("link", { name: "category-1" }));

    // check that everything is reflected correctly
    expect(selectedCategoryModel.selectedCategory.value).toEqual("category-1");
    expect(screen.getByRole("link", { name: "category-1" })).toHaveStyle(
      "font-weight: bold",
    );
    expect(screen.getByLabelText("Selected category:")).toHaveValue(
      "category-1",
    );
    expect(screen.getByText(/Reminder 1/)).toBeInTheDocument();
    expect(screen.getByText(/Reminder 2/)).toBeInTheDocument();
    expect(screen.queryByText(/Reminder 3/)).toBeNull();
    expect(screen.queryByText(/Reminder 4/)).toBeNull();

    // set the category via the sidebar
    await userEvent.click(screen.getByRole("link", { name: "category-2" }));

    // check that everything is reflected correctly
    expect(selectedCategoryModel.selectedCategory.value).toEqual("category-2");
    expect(screen.getByRole("link", { name: "category-2" })).toHaveStyle(
      "font-weight: bold",
    );
    expect(screen.getByLabelText("Selected category:")).toHaveValue(
      "category-2",
    );
    expect(screen.queryByText(/Reminder 1/)).toBeNull();
    expect(screen.queryByText(/Reminder 2/)).toBeNull();
    expect(screen.getByText(/Reminder 3/)).toBeInTheDocument();
    expect(screen.getByText(/Reminder 4/)).toBeInTheDocument();
  });
});
