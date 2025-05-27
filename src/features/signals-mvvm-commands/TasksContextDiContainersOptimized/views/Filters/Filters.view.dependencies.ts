import { useFiltersViewModel } from "./Filters.view-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export interface FiltersDependencies {
  useFiltersViewModel: typeof useFiltersViewModel;
}

const defaultDependencies: FiltersDependencies = {
  useFiltersViewModel,
};

export default defaultDependencies;
