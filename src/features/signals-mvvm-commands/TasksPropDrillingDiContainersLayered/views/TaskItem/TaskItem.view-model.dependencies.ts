import { createUserModel, IUserModel } from "../../models/user.model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type TaskItemViewModelDependencies = {
  createUserModel: (
    ...args: Parameters<typeof createUserModel>
  ) => Pick<IUserModel, "user">;
};

const defaultDependencies: TaskItemViewModelDependencies = {
  createUserModel,
};

export default defaultDependencies;
