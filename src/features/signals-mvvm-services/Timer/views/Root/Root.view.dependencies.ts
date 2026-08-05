import { Timer } from "../Timer/Timer.view";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type RootDependencies = {
  Timer: typeof Timer;
};

const defaultDependencies: RootDependencies = {
  Timer,
};

export default defaultDependencies;
