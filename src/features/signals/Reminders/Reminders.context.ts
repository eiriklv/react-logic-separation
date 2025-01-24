import React from "react";
import { useRemindersModel } from "./model";
import { ReminderItem } from "./components/ReminderItem";
import {
  useAddReminder,
  useIsFetching,
  useIsLoading,
  useIsSaving,
  useReminders,
  useRemindersCount,
} from "./hooks";

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
  useReminders: typeof useReminders;
  useRemindersCount: typeof useRemindersCount;
  useIsLoading: typeof useIsLoading;
  useIsFetching: typeof useIsFetching;
  useIsSaving: typeof useIsSaving;
  useAddReminder: typeof useAddReminder;
  ReminderItem: typeof ReminderItem;
}

export const defaultValue: RemindersContextInterface = {
  useReminders,
  useRemindersCount,
  useIsLoading,
  useIsFetching,
  useIsSaving,
  useAddReminder,
  ReminderItem,
};

export const RemindersContext =
  React.createContext<RemindersContextInterface>(defaultValue);
