import { createContext, useCallback, useContext, useState } from "react";
import { useRemindersModel } from "./model";
import { ReminderItem } from "./components/ReminderItem";

/**
 * Same as Todos, except stored on the server
 * and using query + mutation (cache invalidation)
 */
export function Reminders() {
  // Get dependencies
  const { useRemindersModel, ReminderItem } = useContext(RemindersContext);

  // Use the reminders model (state and commands)
  const {
    reminders,
    remindersCount,
    isLoading,
    isFetching,
    isSaving,
    addReminder,
  } = useRemindersModel();

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

/**
 * The context can be used to inject any kind of
 * dependency, but mainly hooks and components/containers.
 *
 * The main purpose is to facilitate testing
 * and storybooking without having to make complex mocks
 * - and to keep the components as simple as possible.
 *
 * Can be used for integrating 3rd party libraries and
 * components into your application
 *
 * The other purpose is to completely avoid prop drilling,
 * which reduces the amount of indirection in components.
 *
 * The interfaces of the components also become much simpler.
 */

export interface RemindersContextInterface {
  useRemindersModel: typeof useRemindersModel;
  ReminderItem: typeof ReminderItem;
}

export const defaultValue: RemindersContextInterface = {
  useRemindersModel,
  ReminderItem,
};

export const RemindersContext =
  createContext<RemindersContextInterface>(defaultValue);
