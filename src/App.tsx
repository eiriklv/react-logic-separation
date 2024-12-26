import { TimerFeature as TimerEasyPeasy } from "./features/easy-peasy/Timer";
import { TodosFeature as TodosEasyPeasy } from "./features/easy-peasy/Todos";
import { TodosFeature as TodosJotai } from "./features/jotai/Todos";
import "./App.css";

function App() {
  return (
    <>
      <TimerEasyPeasy />
      <TodosEasyPeasy />
      <TodosJotai />
    </>
  );
}

export default App;
