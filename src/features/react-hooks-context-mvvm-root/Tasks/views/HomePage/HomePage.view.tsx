import defaultDependencies from "./HomePage.view.dependencies";
import { HomePageDependencies } from "./HomePage.view.dependencies";

type Props = {
  dependencies?: HomePageDependencies;
};

/**
 * Example of a view that serves as a "Page" in the tree.
 * There's no difference between it and other views really - only the way it's being mounted in the tree.
 */
export function HomePage({ dependencies = defaultDependencies }: Props) {
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
