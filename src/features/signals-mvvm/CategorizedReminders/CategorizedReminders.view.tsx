import { useContext } from "react";
import { CategorizedRemindersContext } from "./CategorizedReminders.view.context";

export function CategorizedReminders() {
  // Get dependencies
  const { Topbar, CategorySidebar, Reminders } = useContext(
    CategorizedRemindersContext,
  );

  return (
    <div>
      <Topbar />
      <div>
        <CategorySidebar />
        <Reminders />
      </div>
    </div>
  );
}
