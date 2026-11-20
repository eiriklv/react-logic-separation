import { HomePage } from "../HomePage/HomePage.view";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type AppDependencies = {
  HomePage: typeof HomePage;
};

const defaultDependencies: AppDependencies = {
  HomePage,
};

export default defaultDependencies;
