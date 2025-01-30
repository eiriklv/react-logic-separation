import { useCallback, useContext, useState } from "react";
import { RemindersContext } from "./Reminders.context";

/**
 * Same as Todos, except stored on the server
 * and using query + mutation (cache invalidation)
 */
export function Reminders() {
  // Get dependencies
  const { useRemindersViewModel, ReminderItem } = useContext(RemindersContext);

  // Use view model
  const {
    reminders,
    remindersCount,
    isLoading,
    isFetching,
    isSaving,
    addReminder,
  } = useRemindersViewModel();

  // Create local view state for form/input
  const [reminderInputText, setReminderInputText] = useState("");

  // Create local view event handler for form
  const handleReminderInputTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReminderInputText(event.target.value);
    },
    [],
  );

  // Create local view event handler for form
  const handleReminderInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        addReminder(reminderInputText);
        setReminderInputText("");
      }
    },
    [addReminder, reminderInputText],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const reminderElements = reminders.map((reminder) => (
    <ReminderItem key={reminder.id} reminder={reminder}></ReminderItem>
  ));

  return (
    <div>
      <pre>react-hooks</pre>
      <h3>
        Reminders <span>{isSaving && "(saving...)"}</span>
      </h3>
      <h4>Things to remember: {remindersCount}</h4>
      <label>
        Remind me to
        <input
          name="remind"
          type="text"
          value={reminderInputText}
          onChange={handleReminderInputTextChange}
          onKeyDown={handleReminderInputKeyDown}
        />
      </label>
      <ul>{reminderElements}</ul>
      {isFetching && <div>wait...</div>}
    </div>
  );
}
