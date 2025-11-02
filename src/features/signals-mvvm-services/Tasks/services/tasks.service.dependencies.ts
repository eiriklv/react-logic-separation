import { generateId } from "../../../../lib/utils";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type TasksServiceDependencies = {
  generateId: () => string;
};

const defaultDependencies: TasksServiceDependencies = {
  generateId,
};

export default defaultDependencies;
