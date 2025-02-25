import { useContext, useMemo } from "react";
import { CategorizedRemindersContext } from "./CategorizedReminders.view.context";

import {
  defaultValue as remindersViewModelContextDefaultValue,
  RemindersViewModelContext,
} from "./containers/Reminders/Reminders.view-model.context";

import {
  defaultValue as topbarViewModelContextDefaultValue,
  TopbarViewModelContext,
} from "./containers/Topbar/Topbar.view-model.context";

import {
  defaultValue as categorySidebarViewModelContextDefaultValue,
  CategorySidebarViewModelContext,
} from "./containers/CategorySidebar/CategorySidebar.view-model.context";

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

  const topbarViewModelDependencies = useMemo(
    () => ({
      ...topbarViewModelContextDefaultValue,
      selectedCategoryModel,
    }),
    [selectedCategoryModel],
  );

  const categorySidebarViewModelDependencies = useMemo(
    () => ({
      ...categorySidebarViewModelContextDefaultValue,
      selectedCategoryModel,
    }),
    [selectedCategoryModel],
  );

  const remindersViewModelDependencies = useMemo(
    () => ({
      ...remindersViewModelContextDefaultValue,
      selectedCategoryModel,
    }),
    [selectedCategoryModel],
  );

  return (
    <div>
      <TopbarViewModelContext.Provider value={topbarViewModelDependencies}>
        <Topbar />
      </TopbarViewModelContext.Provider>
      <div>
        <CategorySidebarViewModelContext.Provider
          value={categorySidebarViewModelDependencies}
        >
          <CategorySidebar />
        </CategorySidebarViewModelContext.Provider>
        <RemindersViewModelContext.Provider
          value={remindersViewModelDependencies}
        >
          <Reminders />
        </RemindersViewModelContext.Provider>
      </div>
    </div>
  );
}
