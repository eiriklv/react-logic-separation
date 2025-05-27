import { generateId } from "../../../../lib/utils";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type TasksServiceDependencies = {
  generateId: () => string;
  delay: number;
};

const defaultDependencies: TasksServiceDependencies = {
  generateId,
  delay: 1000,
};

export default defaultDependencies;
