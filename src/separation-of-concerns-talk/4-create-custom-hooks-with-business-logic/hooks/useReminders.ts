import { useQuery } from "@tanstack/react-query";
import * as remindersService from "../services/reminders.service";
import { Reminder } from "../types";
import { useMemo } from "react";

export const useReminders = () => {
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

  // Computed
  const remindersCount = useMemo(() => reminders.length, [reminders]);

  return {
    reminders,
    remindersCount,
    failedToFetchRemindersError,
    isLoading,
    isFetching,
  };
};
