import { App } from "../../views/App/App.view";
import { useRootViewModel } from "./Root.view-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type RootDependencies = {
  useRootViewModel: typeof useRootViewModel;
  App: typeof App;
};

const defaultDependencies: RootDependencies = {
  useRootViewModel,
  App,
};

export default defaultDependencies;
