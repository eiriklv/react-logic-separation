import { Render } from "@cognite/pulse/react-views";
import { Todos } from "./Todos";

export function TodosFeature() {
  return <Render element={Todos()} />;
}
