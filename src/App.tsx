import { TimerFeature as TimerReactNaive } from "./features/react-naive/Timer";
import { TimerFeature as TimerReactHooks } from "./features/react-hooks/Timer";
import { TimerFeature as TimerReactHooksContext } from "./features/react-hooks-context/Timer";
import { TimerFeature as TimerEasyPeasy } from "./features/easy-peasy/Timer";
import { TimerFeature as TimerJotai } from "./features/jotai/Timer";
import { TimerFeature as TimerSignals } from "./features/signals/Timer";
import { TimerFeature as TimerPulseNaive } from "./features/pulse-naive/Timer";
import { TimerFeature as TimerPulse } from "./features/pulse/Timer";
import { ConditionalTimerFeature as ConditionalTimerReactNaive } from "./features/react-naive/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerReactHooks } from "./features/react-hooks/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerReactHooksContext } from "./features/react-hooks-context/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerEasyPeasy } from "./features/easy-peasy/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerJotai } from "./features/jotai/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerSignals } from "./features/signals/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerPulseNaive } from "./features/pulse-naive/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerPulse } from "./features/pulse/ConditionalTimer";
import { TodosFeature as TodosReactNaive } from "./features/react-naive/Todos";
import { TodosFeature as TodosReactHooks } from "./features/react-hooks/Todos";
import { TodosFeature as TodosReactHooksContext } from "./features/react-hooks-context/Todos";
import { TodosFeature as TodosEasyPeasy } from "./features/easy-peasy/Todos";
import { TodosFeature as TodosJotai } from "./features/jotai/Todos";
import { TodosFeature as TodosSignals } from "./features/signals/Todos";
import { TodosFeature as TodosPulseNaive } from "./features/pulse-naive/Todos";
import { TodosFeature as TodosPulse } from "./features/pulse/Todos";
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
        <TimerPulseNaive />
        <TimerPulse />
      </div>
      <div className="feature-group">
        <ConditionalTimerReactNaive />
        <ConditionalTimerReactHooks />
        <ConditionalTimerReactHooksContext />
        <ConditionalTimerEasyPeasy />
        <ConditionalTimerJotai />
        <ConditionalTimerSignals />
        <ConditionalTimerPulseNaive />
        <ConditionalTimerPulse />
      </div>
      <div className="feature-group">
        <TodosReactNaive />
        <TodosReactHooks />
        <TodosReactHooksContext />
        <TodosEasyPeasy />
        <TodosJotai />
        <TodosSignals />
        <TodosPulseNaive />
        <TodosPulse />
      </div>
    </>
  );
}

export default App;
