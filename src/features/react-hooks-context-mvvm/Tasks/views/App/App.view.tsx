import defaultDependencies from "./App.view.dependencies";
import { AppDependencies } from "./App.view.dependencies";

type Props = {
  dependencies?: AppDependencies;
};

/**
 * This is the outer application view where your routes would reside.
 * Nested routes can of course live anywhere in the tree downstream to this view.
 */
export function App({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const { Actions, Filters, TaskList } = dependencies;

  return (
    <div>
      <Actions />
      <Filters />
      <TaskList />
    </div>
  );
}
