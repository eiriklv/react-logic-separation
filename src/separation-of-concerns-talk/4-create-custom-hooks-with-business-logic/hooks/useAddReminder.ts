import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as remindersService from "../services/reminders.service";
import { useCallback } from "react";

export const useAddReminder = () => {
  // Query client
  const queryClient = useQueryClient();

  // Mutation
  const {
    mutateAsync: addReminderMutation,
    error: failedToAddReminderError,
    isPending: isSaving,
  } = useMutation({
    mutationFn: (text: string) => remindersService.addReminder(text),
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: ["reminders"] });
    },
  });

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
    addReminder,
    failedToAddReminderError,
    isSaving,
  };
};
