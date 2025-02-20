import { useContext } from "react";
import { RemindersViewModelContext } from "./Reminders.viewmodel.context";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import { SelectedCategoryModel } from "../../models/selected-category-model";

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by providing custom hooks with appropriate
 * interfaces - taking care not to expose
 * implementation details of the business
 * logic itself or libraries used
 *
 * It can also be used for 3rd party library hooks,
 * so that you avoid coupling your component directly.
 * Instead you can provide a nice interface and map
 * the custom hooks into it
 */
export type RemindersViewModelProps = {
  selectedCategoryModel: SelectedCategoryModel;
};

export const useRemindersViewModel = ({
  selectedCategoryModel,
}: RemindersViewModelProps) => {
  const { remindersModel } = useContext(RemindersViewModelContext);

  return {
    reminders: useSignalValue(
      remindersModel.getRemindersByCategory(
        selectedCategoryModel.selectedCategory,
      ),
    ),
    remindersCount: useSignalValue(
      remindersModel.getRemindersCountByCategory(
        selectedCategoryModel.selectedCategory,
      ),
    ),
    isLoading: useSignalValue(remindersModel.isLoading),
    isFetching: useSignalValue(remindersModel.isFetching),
    isSaving: useSignalValue(remindersModel.isSaving),
    addReminder: remindersModel.addReminder,
  };
};
