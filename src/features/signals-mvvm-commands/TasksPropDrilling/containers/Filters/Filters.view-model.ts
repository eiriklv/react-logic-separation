import { useSignalValue } from "../../../../../lib/use-signal-value";
import {
  ISelectedFiltersModel,
  selectedFiltersModelSingleton,
} from "../../models/selected-filters.model";
import { IUsersModel, usersModelSingleton } from "../../models/users.model";

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

export type FiltersViewModelDependencies = {
  selectedFiltersModel: ISelectedFiltersModel;
  usersModel: Pick<IUsersModel, "users">;
};

type Props = {
  dependencies?: FiltersViewModelDependencies;
};

export const useFiltersViewModel = ({
  dependencies = {
    selectedFiltersModel: selectedFiltersModelSingleton,
    usersModel: usersModelSingleton,
  },
}: Props = {}) => {
  const { selectedFiltersModel, usersModel } = dependencies;

  return {
    users: useSignalValue(usersModel.users),
    selectedOwnerId: useSignalValue(selectedFiltersModel.selectedOwnerId),
    setSelectedOwnerId: selectedFiltersModel.setSelectedOwnerId,
  };
};
