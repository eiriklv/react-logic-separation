const defaultDependencies = {
  exampleService: () => {},
};

export type Dependencies = typeof defaultDependencies;

// This is imported both in the app and in the test
export const example = (dependencies: Dependencies = defaultDependencies) => {
  dependencies.exampleService();
};
