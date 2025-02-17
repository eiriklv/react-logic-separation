import React from "react";
import { remindersModel } from "../../models/reminders-model";
import { selectedCategoryModel } from "../../models/selected-category-model";

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

export interface CategorySidebarViewModelContextInterface {
  selectedCategoryModel: typeof selectedCategoryModel;
  remindersModel: typeof remindersModel;
}

export const defaultValue: CategorySidebarViewModelContextInterface = {
  selectedCategoryModel,
  remindersModel,
};

export const CategorySidebarViewModelContext =
  React.createContext<CategorySidebarViewModelContextInterface>(defaultValue);
