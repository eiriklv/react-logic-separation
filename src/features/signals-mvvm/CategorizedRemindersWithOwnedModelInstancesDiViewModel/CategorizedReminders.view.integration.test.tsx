import { render, screen } from "@testing-library/react";
import { CategorizedReminders } from "./CategorizedReminders.view";
import {
  CategorizedRemindersContext,
  CategorizedRemindersContextInterface,
} from "./CategorizedReminders.view.context";
import { Topbar } from "./containers/Topbar/Topbar.view";
import { CategorySidebar } from "./containers/CategorySidebar/CategorySidebar.view";
import { Reminders } from "./containers/Reminders/Reminders.view";
import {
  TopbarContext,
  TopbarContextInterface,
} from "./containers/Topbar/Topbar.view.context";
import { useTopbarViewModel } from "./containers/Topbar/Topbar.view-model";
import { SelectedCategoryModel } from "./models/selected-category.model";
import {
  RemindersModel,
  RemindersModelDependencies,
} from "./models/reminders.model";
import { QueryClient } from "@tanstack/query-core";
import { Reminder } from "./types";
import {
  CategorySidebarContext,
  CategorySidebarContextInterface,
} from "./containers/CategorySidebar/CategorySidebar.view.context";
import { useCategorySidebarViewModel } from "./containers/CategorySidebar/CategorySidebar.view-model";
import userEvent from "@testing-library/user-event";
import {
  RemindersContext,
  RemindersContextInterface,
} from "./containers/Reminders/Reminders.view.context";
import { useRemindersViewModel } from "./containers/Reminders/Reminders.view-model";
import { ReminderItem } from "./components/ReminderItem";
import {
  CategorizedRemindersViewModelContext,
  CategorizedRemindersViewModelContextInterface,
} from "./CategorizedReminders.view-model.context";
import { useCategorizedRemindersViewModel } from "./CategorizedReminders.view-model";
import { createProviderTree } from "../../../lib/create-provider-tree";
import {
  TopbarViewModelContext,
  TopbarViewModelContextInterface,
} from "./containers/Topbar/Topbar.view-model.context";
import {
  CategorySidebarViewModelContext,
  CategorySidebarViewModelContextInterface,
} from "./containers/CategorySidebar/CategorySidebar.view-model.context";
import {
  RemindersViewModelContext,
  RemindersViewModelContextInterface,
} from "./containers/Reminders/Reminders.view-model.context";

/**
 * This one actually catches more integration errors than
 * the one below, just for the fact that it will use the
 * default dependencies, which might have been imported wrong
 */
describe("CategorizedReminders Integration (only necessary dependencies)", () => {
  it("should reflect changes in category in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock reminders
    const mockReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    // create dependencies for the RemindersModel
    const remindersModelDependencies: RemindersModelDependencies = {
      remindersService: {
        fetchReminders: vi.fn(async () => mockReminders),
        addReminder: vi.fn(),
      },
    };

    // create an instance of the SelectedCategoryModel (has no dependencies)
    const selectedCategoryModel: SelectedCategoryModel =
      new SelectedCategoryModel();

    // create an instance of the RemindersModel using the dependencies
    const remindersModel: RemindersModel = new RemindersModel(
      /**
       * Use the query client instance we created further up
       */
      queryClient,
      /**
       * Use the dependencies we created further up
       */
      remindersModelDependencies,
    );

    // create the dependencies for the categorized reminders view model
    const categorizedRemindersViewModelDependencies: CategorizedRemindersViewModelContextInterface =
      {
        /**
         * Use the instance of selected category model we created further up
         */
        createSelectedCategoryModel: () => selectedCategoryModel,
        categorySidebarViewModelContextDefaultValue: {
          remindersModel,
          selectedCategoryModel,
        },
        remindersViewModelContextDefaultValue: {
          remindersModel,
          selectedCategoryModel,
        },
        topbarViewModelContextDefaultValue: {
          remindersModel,
          selectedCategoryModel,
        },
      };

    // create the dependencies for the categorized reminders container
    const categorizedRemindersDependencies: CategorizedRemindersContextInterface =
      {
        /**
         * Use the real implementations of all the sub-containers
         */
        useCategorizedRemindersViewModel,
        Topbar,
        CategorySidebar,
        Reminders,
      };

    // create provider tree stack
    const Providers = createProviderTree([
      <CategorizedRemindersViewModelContext.Provider
        value={categorizedRemindersViewModelDependencies}
      />,
      <CategorizedRemindersContext.Provider
        value={categorizedRemindersDependencies}
      />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <CategorizedReminders />
      </Providers>,
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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

describe("CategorizedReminders Integration (all dependencies explicit)", () => {
  it("should reflect changes in category in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock reminders
    const mockReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    // create dependencies for the RemindersModel
    const remindersModelDependencies: RemindersModelDependencies = {
      remindersService: {
        fetchReminders: vi.fn(async () => mockReminders),
        addReminder: vi.fn(),
      },
    };

    // create an instance of the SelectedCategoryModel (has no dependencies)
    const selectedCategoryModel: SelectedCategoryModel =
      new SelectedCategoryModel();

    // create an instance of the RemindersModel using the dependencies
    const remindersModel: RemindersModel = new RemindersModel(
      /**
       * Use the query client instance we created further up
       */
      queryClient,
      /**
       * Use the dependencies we created further up
       */
      remindersModelDependencies,
    );

    // create the dependencies for the Topbar container
    const topbarDependencies: TopbarContextInterface = {
      /**
       * Use the real viewmodel hook since it's
       * part of the integration we want to test
       */
      useTopbarViewModel,
    };

    // create the dependencies for the category sidebar container
    const categorySidebarDependencies: CategorySidebarContextInterface = {
      /**
       * Use the real viewmodel hook since it's
       * part of the integration we want to test
       */
      useCategorySidebarViewModel,
    };

    // create the dependencies for the reminders container
    const remindersDependencies: RemindersContextInterface = {
      /**
       * Use the real view model hook since it's
       * part of the integration we want to test
       */
      useRemindersViewModel,
      /**
       * Use the real implementation of the
       * reminder item component, since it's
       * part of the integration we want to test
       */
      ReminderItem,
    };

    // create the dependencies for the categorized reminders container
    const categorizedRemindersDependencies: CategorizedRemindersContextInterface =
      {
        /**
         * Use the real implementations of all the sub-containers
         */
        useCategorizedRemindersViewModel,
        Topbar,
        CategorySidebar,
        Reminders,
      };

    // create the dependencies for the categorized reminders view model
    const categorizedRemindersViewModelDependencies: CategorizedRemindersViewModelContextInterface =
      {
        /**
         * Use the instance of reminders model we created further up
         */
        createSelectedCategoryModel: () => selectedCategoryModel,
        categorySidebarViewModelContextDefaultValue: {
          remindersModel,
          selectedCategoryModel,
        },
        remindersViewModelContextDefaultValue: {
          remindersModel,
          selectedCategoryModel,
        },
        topbarViewModelContextDefaultValue: {
          remindersModel,
          selectedCategoryModel,
        },
      };

    // create provider tree stack
    const Providers = createProviderTree([
      <CategorizedRemindersViewModelContext.Provider
        value={categorizedRemindersViewModelDependencies}
      />,
      <TopbarContext.Provider value={topbarDependencies} />,
      <CategorySidebarContext.Provider value={categorySidebarDependencies} />,
      <RemindersContext.Provider value={remindersDependencies} />,
      <CategorizedRemindersContext.Provider
        value={categorizedRemindersDependencies}
      />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <CategorizedReminders />
      </Providers>,
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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

describe("CategorizedReminders Integration (all dependencies explicit - overriding view providers)", () => {
  it("should reflect changes in category in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock reminders
    const mockReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    // create dependencies for the RemindersModel
    const remindersModelDependencies: RemindersModelDependencies = {
      remindersService: {
        fetchReminders: vi.fn(async () => mockReminders),
        addReminder: vi.fn(),
      },
    };

    // create an instance of the SelectedCategoryModel (has no dependencies)
    const selectedCategoryModel: SelectedCategoryModel =
      new SelectedCategoryModel();

    // create an instance of the RemindersModel using the dependencies
    const remindersModel: RemindersModel = new RemindersModel(
      /**
       * Use the query client instance we created further up
       */
      queryClient,
      /**
       * Use the dependencies we created further up
       */
      remindersModelDependencies,
    );

    // create the dependencies for the Topbar container
    const topbarDependencies: TopbarContextInterface = {
      /**
       * Use the real viewmodel hook since it's
       * part of the integration we want to test
       */
      useTopbarViewModel,
    };

    // create the dependencies for the category sidebar container
    const categorySidebarDependencies: CategorySidebarContextInterface = {
      /**
       * Use the real viewmodel hook since it's
       * part of the integration we want to test
       */
      useCategorySidebarViewModel,
    };

    // create the dependencies for the reminders container
    const remindersDependencies: RemindersContextInterface = {
      /**
       * Use the real view model hook since it's
       * part of the integration we want to test
       */
      useRemindersViewModel,
      /**
       * Use the real implementation of the
       * reminder item component, since it's
       * part of the integration we want to test
       */
      ReminderItem,
    };

    // create the dependencies for the categorized reminders container
    const categorizedRemindersDependencies: CategorizedRemindersContextInterface =
      {
        /**
         * Use the real implementations of all the sub-containers
         */
        useCategorizedRemindersViewModel: () => ({
          categorySidebarViewModelDependencies: {
            remindersModel,
            selectedCategoryModel,
          },
          remindersViewModelDependencies: {
            remindersModel,
            selectedCategoryModel,
          },
          topbarViewModelDependencies: {
            remindersModel,
            selectedCategoryModel,
          },
        }),
        Topbar: () => (
          <TopbarContext.Provider value={topbarDependencies}>
            <Topbar />
          </TopbarContext.Provider>
        ),
        CategorySidebar: () => (
          <CategorySidebarContext.Provider value={categorySidebarDependencies}>
            <CategorySidebar />
          </CategorySidebarContext.Provider>
        ),
        Reminders: () => (
          <RemindersContext.Provider value={remindersDependencies}>
            <Reminders />
          </RemindersContext.Provider>
        ),
      };

    // create provider tree stack
    const Providers = createProviderTree([
      <CategorizedRemindersContext.Provider
        value={categorizedRemindersDependencies}
      />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <CategorizedReminders />
      </Providers>,
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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

describe("CategorizedReminders Integration (all dependencies explicit - overriding view and view model providers)", () => {
  it("should reflect changes in category in all applicable views", async () => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock reminders
    const mockReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    // create dependencies for the RemindersModel
    const remindersModelDependencies: RemindersModelDependencies = {
      remindersService: {
        fetchReminders: vi.fn(async () => mockReminders),
        addReminder: vi.fn(),
      },
    };

    // create an instance of the SelectedCategoryModel (has no dependencies)
    const selectedCategoryModel: SelectedCategoryModel =
      new SelectedCategoryModel();

    // create an instance of the RemindersModel using the dependencies
    const remindersModel: RemindersModel = new RemindersModel(
      /**
       * Use the query client instance we created further up
       */
      queryClient,
      /**
       * Use the dependencies we created further up
       */
      remindersModelDependencies,
    );

    // create the dependencies for the Topbar container
    const topbarDependencies: TopbarContextInterface = {
      /**
       * Use the real viewmodel hook since it's
       * part of the integration we want to test
       */
      useTopbarViewModel,
    };

    // create the dependencies for the Topbar view model
    const topbarViewModelDependencies: TopbarViewModelContextInterface = {
      remindersModel,
      selectedCategoryModel,
    };

    // create the dependencies for the category sidebar container
    const categorySidebarDependencies: CategorySidebarContextInterface = {
      /**
       * Use the real viewmodel hook since it's
       * part of the integration we want to test
       */
      useCategorySidebarViewModel,
    };

    // create the dependencies for the category sidebar view model
    const categorySidebarViewModelDependencies: CategorySidebarViewModelContextInterface =
      {
        remindersModel,
        selectedCategoryModel,
      };

    // create the dependencies for the reminders container
    const remindersDependencies: RemindersContextInterface = {
      /**
       * Use the real view model hook since it's
       * part of the integration we want to test
       */
      useRemindersViewModel,
      /**
       * Use the real implementation of the
       * reminder item component, since it's
       * part of the integration we want to test
       */
      ReminderItem,
    };

    // create the dependencies for the category sidebar view model
    const remindersViewModelDependencies: RemindersViewModelContextInterface = {
      selectedCategoryModel,
      remindersModel,
    };

    // create the dependencies for the categorized reminders container
    const categorizedRemindersDependencies: CategorizedRemindersContextInterface =
      {
        /**
         * Use the real implementations of all the sub-containers
         */
        useCategorizedRemindersViewModel,
        Topbar: () => (
          <TopbarViewModelContext.Provider value={topbarViewModelDependencies}>
            <TopbarContext.Provider value={topbarDependencies}>
              <Topbar />
            </TopbarContext.Provider>
          </TopbarViewModelContext.Provider>
        ),
        CategorySidebar: () => (
          <CategorySidebarViewModelContext.Provider
            value={categorySidebarViewModelDependencies}
          >
            <CategorySidebarContext.Provider
              value={categorySidebarDependencies}
            >
              <CategorySidebar />
            </CategorySidebarContext.Provider>
          </CategorySidebarViewModelContext.Provider>
        ),
        Reminders: () => (
          <RemindersViewModelContext.Provider
            value={remindersViewModelDependencies}
          >
            <RemindersContext.Provider value={remindersDependencies}>
              <Reminders />
            </RemindersContext.Provider>
          </RemindersViewModelContext.Provider>
        ),
      };

    // create the dependencies for the categorized reminders view model
    const categorizedRemindersViewModelDependencies: CategorizedRemindersViewModelContextInterface =
      {
        createSelectedCategoryModel: () => selectedCategoryModel,
        /**
         * In reality, because of overriding the dependencies
         * in the view provider these aren't used for anything
         * during this test
         */
        categorySidebarViewModelContextDefaultValue:
          categorySidebarViewModelDependencies,
        remindersViewModelContextDefaultValue: remindersViewModelDependencies,
        topbarViewModelContextDefaultValue: topbarViewModelDependencies,
      };

    // create provider tree stack
    const Providers = createProviderTree([
      <CategorizedRemindersViewModelContext.Provider
        value={categorizedRemindersViewModelDependencies}
      />,
      <CategorizedRemindersContext.Provider
        value={categorizedRemindersDependencies}
      />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(
      <Providers>
        <CategorizedReminders />
      </Providers>,
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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
    expect(screen.getByRole("link", { name: "category-2" })).not.toHaveStyle(
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
    expect(screen.getByRole("link", { name: "category-1" })).not.toHaveStyle(
      "font-weight: bold",
    );
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
