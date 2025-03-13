const defaultDependencies = {
  exampleService: () => {},
};

export type Dependencies = typeof defaultDependencies;

// This is imported and tested in the test
export class Example {
  private _dependencies: Dependencies;

  constructor(dependencies: Dependencies = defaultDependencies) {
    this._dependencies = dependencies;
  }

  public example() {
    this._dependencies.exampleService();
  }
}

// This imported and used in the app
export const exampleSingleton = new Example();
