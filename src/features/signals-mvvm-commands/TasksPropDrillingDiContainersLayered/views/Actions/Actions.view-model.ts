import { PickDeep } from "type-fest";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import {
  useModels,
  ModelsContextInterface,
} from "../../providers/models.provider";

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

/**
 * Specify which subset of models
 * we depend on in this module
 */
export type ModelsDependencies = PickDeep<
  ModelsContextInterface,
  "tasksModel.addTask" | "usersModel.users"
>;

export const useActionsViewModel = () => {
  // Get models from models provider
  const models = useModels<ModelsDependencies>();

  // Pull out the stuff we want from the shared models
  const { usersModel, tasksModel } = models;

  return {
    users: useSignalValue(usersModel.users),
    addTask: tasksModel.addTask,
  };
};
