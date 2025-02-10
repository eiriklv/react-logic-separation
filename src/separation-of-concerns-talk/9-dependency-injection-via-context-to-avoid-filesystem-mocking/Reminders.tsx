import { useCallback, useContext, useState } from "react";
import { ReminderItem } from "./components/ReminderItem";
import { RemindersContext } from "./Reminders.context";

// Feature container
export function Reminders() {
  // Injected depedencies
  const { useRemindersModel } = useContext(RemindersContext);

  // Reminders model
  const {
    reminders = [],
    remindersCount,
    failedToFetchRemindersError,
    failedToAddReminderError,
    isSaving,
    isLoading,
    isFetching,
    addReminder,
  } = useRemindersModel();

  // Local view state for form/input
  const [reminderInputText, setReminderInputText] = useState("");

  // Local view event handler for form
  const handleReminderInputTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReminderInputText(event.target.value);
    },
    [],
  );

  // Local view event handler for form
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
      <pre>4-1</pre>
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
      {failedToFetchRemindersError && (
        <div>
          Failed to fetch reminders: {failedToFetchRemindersError.message}
        </div>
      )}
      {failedToAddReminderError && (
        <div>Failed to add reminder: {failedToAddReminderError.message}</div>
      )}
      {(isFetching || isSaving) && <div>wait...</div>}
    </div>
  );
}
