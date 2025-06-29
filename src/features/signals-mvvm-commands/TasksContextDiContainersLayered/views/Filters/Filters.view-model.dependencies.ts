import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { IUsersModel } from "../../models/users.model";
import { useModels } from "../../providers/models.provider";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

/**
 * Specify which subset of models
 * we depend on in this module
 */
export type ModelsDependencies = {
  usersModel: Pick<IUsersModel, "users">;
  selectedFiltersModel: ISelectedFiltersModel;
};

export interface FiltersViewModelDependencies {
  useModels: () => ModelsDependencies;
}

const defaultDependencies: FiltersViewModelDependencies = {
  useModels,
};

export default defaultDependencies;
