import { useSignalValue } from "../../../../../lib/use-signal-value";
import { ITasksModel, tasksModelSingleton } from "../../models/tasks.model";
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

export type ActionsViewModelDependencies = {
  tasksModel: Pick<ITasksModel, "addTask">;
  usersModel: Pick<IUsersModel, "users">;
};

type Props = {
  dependencies?: ActionsViewModelDependencies;
};

export const useActionsViewModel = ({
  dependencies = {
    tasksModel: tasksModelSingleton,
    usersModel: usersModelSingleton,
  },
}: Props = {}) => {
  const { tasksModel, usersModel } = dependencies;

  return {
    users: useSignalValue(usersModel.users),
    addTask: tasksModel.addTask,
  };
};
