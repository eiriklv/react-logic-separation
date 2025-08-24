const defaultDependencies = {
  exampleService: () => {},
};

export type Dependencies = typeof defaultDependencies;

// This is imported and tested in the test
export const createExample = (
  dependencies: Dependencies = defaultDependencies,
) => {
  return function example() {
    dependencies.exampleService();
  };
};

// This imported and used in the app
export const exampleSingleton = createExample();
