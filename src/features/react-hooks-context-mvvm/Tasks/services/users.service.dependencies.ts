import { User } from "../types";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type UsersServiceDependencies = {
  initialUsers?: User[];
};

const defaultDependencies: UsersServiceDependencies = {};

export default defaultDependencies;
