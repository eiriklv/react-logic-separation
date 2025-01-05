import { TimerFeature as TimerReactNaive } from "./features/react-naive/Timer";
import { TimerFeature as TimerReactHooks } from "./features/react-hooks/Timer";
import { TimerFeature as TimerReactHooksContext } from "./features/react-hooks-context/Timer";
import { TimerFeature as TimerEasyPeasy } from "./features/easy-peasy/Timer";
import { TimerFeature as TimerJotai } from "./features/jotai/Timer";
import { TimerFeature as TimerSignals } from "./features/signals/Timer";
import { ConditionalTimerFeature as ConditionalTimerReactNaive } from "./features/react-naive/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerReactHooks } from "./features/react-hooks/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerReactHooksContext } from "./features/react-hooks-context/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerEasyPeasy } from "./features/easy-peasy/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerJotai } from "./features/jotai/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerSignals } from "./features/signals/ConditionalTimer";
import { TodosFeature as TodosReactNaive } from "./features/react-naive/Todos";
import { TodosFeature as TodosReactHooks } from "./features/react-hooks/Todos";
import { TodosFeature as TodosReactHooksContext } from "./features/react-hooks-context/Todos";
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
        <TimerReactHooksContext />
        <TimerEasyPeasy />
        <TimerJotai />
        <TimerSignals />
      </div>
      <div className="feature-group">
        <ConditionalTimerReactNaive />
        <ConditionalTimerReactHooks />
        <ConditionalTimerReactHooksContext />
        <ConditionalTimerEasyPeasy />
        <ConditionalTimerJotai />
        <ConditionalTimerSignals />
      </div>
      <div className="feature-group">
        <TodosReactNaive />
        <TodosReactHooks />
        <TodosReactHooksContext />
        <TodosEasyPeasy />
        <TodosJotai />
        <TodosSignals />
      </div>
    </>
  );
}

export default App;
