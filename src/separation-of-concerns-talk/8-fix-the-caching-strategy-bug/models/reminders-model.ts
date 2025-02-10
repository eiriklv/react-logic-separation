import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as remindersService from "../services/reminders.service";
import { useCallback, useMemo } from "react";
import { Reminder } from "../types";

export const useRemindersModel = () => {
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

  return {
    reminders,
    remindersCount,
    failedToFetchRemindersError,
    failedToAddReminderError,
    isSaving,
    isLoading,
    isFetching,
    addReminder,
  };
};
