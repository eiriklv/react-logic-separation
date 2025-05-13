import { useCallback, useContext, useState } from "react";
import { RemindersContext } from "./Reminders.view.context";
import { SelectedCategoryModel } from "../../models/selected-category.model";

/**
 * Same as Todos, except stored on the server
 * and using query + mutation (cache invalidation)
 */
type Props = {
  selectedCategoryModel: SelectedCategoryModel;
};

export function Reminders({ selectedCategoryModel }: Props) {
  // Get dependencies
  const { useRemindersViewModel, ReminderItem } = useContext(RemindersContext);

  // Use the view model (state and commands)
  const {
    reminders = [],
    remindersCount,
    isLoading,
    isFetching,
    isSaving,
    addReminder,
  } = useRemindersViewModel({ selectedCategoryModel });

  // Local view state for form/input
  const [reminderInputText, setReminderInputText] = useState("");
  const [categoryInputText, setCategoryInputText] = useState("");

  // Create local view event handler for form
  const handleReminderInputTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReminderInputText(event.target.value);
    },
    [],
  );

  const handleCategoryInputTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryInputText(event.target.value);
    },
    [],
  );

  // Create local view event handler for form
  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        addReminder(reminderInputText, categoryInputText);
        setReminderInputText("");
        setCategoryInputText("");
      }
    },
    [addReminder, categoryInputText, reminderInputText],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const reminderElements = reminders.map((reminder) => (
    <ReminderItem key={reminder.id} reminder={reminder}></ReminderItem>
  ));

  return (
    <div>
      <pre>signals-mvvm</pre>
      <h3>
        Reminders <span>{isSaving && "(saving...)"}</span>
      </h3>
      <h4>Things to remember: {remindersCount}</h4>
      <label>
        Remind me to:
        <input
          name="remind"
          type="text"
          value={reminderInputText}
          onChange={handleReminderInputTextChange}
          onKeyDown={handleInputKeyDown}
        />
      </label>
      <label>
        Category:
        <input
          name="category"
          type="text"
          value={categoryInputText}
          onChange={handleCategoryInputTextChange}
          onKeyDown={handleInputKeyDown}
        />
      </label>
      <ul>{reminderElements}</ul>
      {isFetching && <div>wait...</div>}
    </div>
  );
}
