import { TimerFeature as TimerEasyPeasy } from "./features/easy-peasy/Timer";
import { TimerFeature as TimerJotai } from "./features/jotai/Timer";
import { TimerFeature as TimerSignals } from "./features/signals/Timer";
import { TodosFeature as TodosEasyPeasy } from "./features/easy-peasy/Todos";
import { TodosFeature as TodosJotai } from "./features/jotai/Todos";
import { TodosFeature as TodosSignals } from "./features/signals/Todos";
import "./App.css";

function App() {
  return (
    <>
      <TimerEasyPeasy />
      <TimerJotai />
      <TimerSignals />
      <TodosEasyPeasy />
      <TodosJotai />
      <TodosSignals />
    </>
  );
}

export default App;
