/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type UsersServiceDependencies = {
  delay: number;
};

const defaultDependencies: UsersServiceDependencies = {
  delay: 1000,
};

export default defaultDependencies;
