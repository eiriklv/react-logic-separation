import { useContext } from "react";
import { CategorizedRemindersContext } from "./CategorizedReminders.context";

import {
  defaultValue as remindersViewModelContextDefaultValue,
  RemindersViewModelContext,
} from "./containers/Reminders/Reminders.viewmodel.context";

import {
  defaultValue as topbarViewModelContextDefaultValue,
  TopbarViewModelContext,
} from "./containers/Topbar/Topbar.viewmodel.context";

import {
  defaultValue as categorySidebarViewModelContextDefaultValue,
  CategorySidebarViewModelContext,
} from "./containers/CategorySidebar/CategorySidebar.viewmodel.context";

export function CategorizedReminders() {
  // Get dependencies
  const {
    useCategorizedRemindersViewModel,
    Topbar,
    CategorySidebar,
    Reminders,
  } = useContext(CategorizedRemindersContext);

  // Use view model
  const { selectedCategoryModel } = useCategorizedRemindersViewModel();

  return (
    <div>
      <TopbarViewModelContext.Provider
        value={{
          ...topbarViewModelContextDefaultValue,
          selectedCategoryModel,
        }}
      >
        <Topbar />
      </TopbarViewModelContext.Provider>
      <div>
        <CategorySidebarViewModelContext.Provider
          value={{
            ...categorySidebarViewModelContextDefaultValue,
            selectedCategoryModel,
          }}
        >
          <CategorySidebar />
        </CategorySidebarViewModelContext.Provider>
        <RemindersViewModelContext.Provider
          value={{
            ...remindersViewModelContextDefaultValue,
            selectedCategoryModel,
          }}
        >
          <Reminders />
        </RemindersViewModelContext.Provider>
      </div>
    </div>
  );
}
