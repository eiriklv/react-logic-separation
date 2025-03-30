import React from "react";
import { createSelectedCategoryModel } from "./models/selected-category.model";
import { defaultValue as remindersViewModelContextDefaultValue } from "./containers/Reminders/Reminders.view-model.context";
import { defaultValue as topbarViewModelContextDefaultValue } from "./containers/Topbar/Topbar.view-model.context";
import { defaultValue as categorySidebarViewModelContextDefaultValue } from "./containers/CategorySidebar/CategorySidebar.view-model.context";

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

export interface CategorizedRemindersViewModelContextInterface {
  createSelectedCategoryModel: typeof createSelectedCategoryModel;
  remindersViewModelContextDefaultValue: typeof remindersViewModelContextDefaultValue;
  topbarViewModelContextDefaultValue: typeof topbarViewModelContextDefaultValue;
  categorySidebarViewModelContextDefaultValue: typeof categorySidebarViewModelContextDefaultValue;
}

export const defaultValue: CategorizedRemindersViewModelContextInterface = {
  createSelectedCategoryModel,
  remindersViewModelContextDefaultValue,
  topbarViewModelContextDefaultValue,
  categorySidebarViewModelContextDefaultValue,
};

export const CategorizedRemindersViewModelContext =
  React.createContext<CategorizedRemindersViewModelContextInterface>(
    defaultValue,
  );
