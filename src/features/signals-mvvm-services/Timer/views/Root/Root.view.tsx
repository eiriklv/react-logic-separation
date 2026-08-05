import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";

type Props = {
  dependencies?: RootDependencies;
};

/**
 * Root container, where all global providers are added
 *
 * In this case the Root is the owner of the services,
 * which makes it responsible for both constructing them
 * and providing them to the rest of the tree below
 */
export function Root({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const { Timer } = dependencies;
  return <Timer />;
}
