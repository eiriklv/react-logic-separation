import { useCallback, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RemindersModelContext } from "./reminders-model.context";
import { Reminder } from "../types";

export const useRemindersModel = () => {
  // Get dependencies
  const { remindersService } = useContext(RemindersModelContext);

  // Query client
  const queryClient = useQueryClient();

  // Queries
  const {
    data: reminders = [],
    isLoading,
    isFetching,
  } = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: () => remindersService.fetchReminders(),
  });

  // Mutations
  const { mutateAsync: addReminderMutation, isPending: isSaving } = useMutation(
    {
      mutationFn: (text: string) => remindersService.addReminder(text),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reminders"] });
      },
    },
  );

  // Computed
  const remindersCount = useMemo(() => reminders.length, [reminders]);

  // Commands
  const addReminder = useCallback(
    async (text: string) => {
      // Validation
      if (!text) {
        return;
      }

      await addReminderMutation(text);
    },
    [addReminderMutation],
  );

  // Public interface
  return {
    reminders,
    remindersCount,
    isLoading,
    isFetching,
    isSaving,
    addReminder,
  };
};
