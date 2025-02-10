import { useCallback, useMemo, useState } from "react";
import * as remindersService from "./services/reminders.service";
import { ReminderItem } from "./components/ReminderItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Reminder } from "./types";

// Feature container
export function Reminders() {
  // Query client
  const queryClient = useQueryClient();

  // Queries
  const {
    data: reminders = [],
    error: failedToFetchRemindersError,
    isLoading,
    isFetching,
  } = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: () => remindersService.fetchReminders(),
    retry: false,
  });

  // Mutation
  const {
    mutateAsync: addReminderMutation,
    error: failedToAddReminderError,
    isPending: isSaving,
  } = useMutation({
    mutationFn: (text: string) => remindersService.addReminder(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  // Computed
  const remindersCount = useMemo(() => reminders.length, [reminders]);

  // Commands
  const addReminder = useCallback(
    async (text: string) => {
      if (!text) {
        return;
      }

      await addReminderMutation(text);
    },
    [addReminderMutation],
  );

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
      <pre>1</pre>
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
