import React from "react";
import { Topbar } from "./containers/Topbar/Topbar";
import { CategorySidebar } from "./containers/CategorySidebar/CategorySidebar";
import { Reminders } from "./containers/Reminders/Reminders";

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

export interface CategorizedRemindersContextInterface {
  Topbar: typeof Topbar;
  CategorySidebar: typeof CategorySidebar;
  Reminders: typeof Reminders;
}

export const defaultValue: CategorizedRemindersContextInterface = {
  Topbar,
  CategorySidebar,
  Reminders,
};

export const CategorizedRemindersContext =
  React.createContext<CategorizedRemindersContextInterface>(defaultValue);
