import defaultDependencies from "./App.view.dependencies";
import { AppDependencies } from "./App.view.dependencies";

type Props = {
  dependencies?: AppDependencies;
};

/**
 * TODO: Move this into the containers folder,
 * and let the Root component live in the root folder instead
 * (and also give it a view model)
 *
 * index.tsx should render the root only
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
