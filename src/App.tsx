import { TimerFeature as TimerReactNaive } from "./features/react-naive/Timer";
import { TimerFeature as TimerReactHooks } from "./features/react-hooks/Timer";
import { TimerFeature as TimerEasyPeasy } from "./features/easy-peasy/Timer";
import { TimerFeature as TimerJotai } from "./features/jotai/Timer";
import { TimerFeature as TimerSignals } from "./features/signals/Timer";
import { TodosFeature as TodosReactNaive } from "./features/react-naive/Todos";
import { TodosFeature as TodosReactHooks } from "./features/react-hooks/Todos";
import { TodosFeature as TodosEasyPeasy } from "./features/easy-peasy/Todos";
import { TodosFeature as TodosJotai } from "./features/jotai/Todos";
import { TodosFeature as TodosSignals } from "./features/signals/Todos";
import "./App.css";

function App() {
  return (
    <>
      <div className="feature-group">
        <TimerReactNaive />
        <TimerReactHooks />
        <TimerEasyPeasy />
        <TimerJotai />
        <TimerSignals />
      </div>
      <div className="feature-group">
        <TodosReactNaive />
        <TodosReactHooks />
        <TodosEasyPeasy />
        <TodosJotai />
        <TodosSignals />
      </div>
    </>
  );
}

export default App;
