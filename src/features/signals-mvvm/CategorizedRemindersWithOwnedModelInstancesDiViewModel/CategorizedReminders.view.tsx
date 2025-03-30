import { useContext } from "react";
import { CategorizedRemindersContext } from "./CategorizedReminders.view.context";
import { RemindersViewModelContext } from "./containers/Reminders/Reminders.view-model.context";
import { TopbarViewModelContext } from "./containers/Topbar/Topbar.view-model.context";
import { CategorySidebarViewModelContext } from "./containers/CategorySidebar/CategorySidebar.view-model.context";

export function CategorizedReminders() {
  // Get dependencies
  const {
    useCategorizedRemindersViewModel,
    Topbar,
    CategorySidebar,
    Reminders,
  } = useContext(CategorizedRemindersContext);

  // Use view model
  const {
    topbarViewModelDependencies,
    categorySidebarViewModelDependencies,
    remindersViewModelDependencies,
  } = useCategorizedRemindersViewModel();

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
