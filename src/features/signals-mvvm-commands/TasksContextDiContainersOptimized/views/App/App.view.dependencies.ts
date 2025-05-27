import { useAppViewModel } from "./App.view-model";
import { Actions } from "../Actions/Actions.view";
import { Filters } from "../Filters/Filters.view";
import { TaskList } from "../TaskList/TaskList.view";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export interface AppDependencies {
  useAppViewModel: typeof useAppViewModel;
  Actions: typeof Actions;
  Filters: typeof Filters;
  TaskList: typeof TaskList;
}

const defaultDependencies: AppDependencies = {
  useAppViewModel,
  Actions,
  Filters,
  TaskList,
};

export default defaultDependencies;
