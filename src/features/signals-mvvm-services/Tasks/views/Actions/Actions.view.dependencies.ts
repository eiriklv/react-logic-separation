import { useActionsViewModel } from "./Actions.view-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type ActionsDependencies = {
  useActionsViewModel: typeof useActionsViewModel;
};

const defaultDependencies: ActionsDependencies = {
  useActionsViewModel,
};

export default defaultDependencies;
