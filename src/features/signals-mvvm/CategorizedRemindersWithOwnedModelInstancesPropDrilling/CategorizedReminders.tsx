import { useContext } from "react";
import { CategorizedRemindersContext } from "./CategorizedReminders.context";

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
      <Topbar selectedCategoryModel={selectedCategoryModel} />
      <div>
        <CategorySidebar selectedCategoryModel={selectedCategoryModel} />
        <Reminders selectedCategoryModel={selectedCategoryModel} />
      </div>
    </div>
  );
}
