import { BrowserRouter, Route, Routes } from "react-router";
import defaultDependencies from "./App.view.dependencies";
import { AppDependencies } from "./App.view.dependencies";

type Props = {
  dependencies?: AppDependencies;
};

/**
 * If we have routing this is where the <Router>
 * provider would live as well. Any view could
 * be used as a page in the routing tree, so
 * there is no diffentiation between different
 * types of views, other than naming it something
 * like TaskPage or AdminPage.
 */
export function App({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const { HomePage } = dependencies;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
