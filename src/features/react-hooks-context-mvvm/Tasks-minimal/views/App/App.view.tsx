import defaultDependencies from "./App.view.dependencies";
import { AppDependencies } from "./App.view.dependencies";

type Props = {
  dependencies?: AppDependencies;
};

/**
 * This is the outer application view where your routes would reside.
 * Nested routes can of course live anywhere in the tree downstream to this view.
 *
 * This view currently (and incidentally) doesn't have a corresponding view model
 * because it doesn't have a need for it. If it did we would create one.
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
