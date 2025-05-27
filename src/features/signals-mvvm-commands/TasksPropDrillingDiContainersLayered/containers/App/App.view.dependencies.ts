import { Actions } from "../../views/Actions/Actions.view";
import { Filters } from "../../views/Filters/Filters.view";
import { TaskList } from "../../views/TaskList/TaskList.view";
import { useAppViewModel } from "./App.view-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type AppDependencies = {
  useAppViewModel: typeof useAppViewModel;
  Actions: typeof Actions;
  Filters: typeof Filters;
  TaskList: typeof TaskList;
};

const defaultDependencies: AppDependencies = {
  useAppViewModel,
  Actions,
  Filters,
  TaskList,
};

export default defaultDependencies;
