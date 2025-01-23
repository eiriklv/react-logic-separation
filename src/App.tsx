import { TimerFeature as TimerReactNaive } from "./features/react-naive/Timer";
import { TimerFeature as TimerReactHooks } from "./features/react-hooks/Timer";
import { TimerFeature as TimerReactHooksContext } from "./features/react-hooks-context/Timer";
import { TimerFeature as TimerEasyPeasy } from "./features/easy-peasy/Timer";
import { TimerFeature as TimerJotai } from "./features/jotai/Timer";
import { TimerFeature as TimerMobx } from "./features/mobx/Timer";
import { TimerFeature as TimerSignals } from "./features/signals/Timer";
import { TimerFeature as TimerPulse } from "./features/pulse/Timer";
import { ConditionalTimerFeature as ConditionalTimerReactNaive } from "./features/react-naive/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerReactHooks } from "./features/react-hooks/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerReactHooksContext } from "./features/react-hooks-context/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerEasyPeasy } from "./features/easy-peasy/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerJotai } from "./features/jotai/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerMobx } from "./features/mobx/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerSignals } from "./features/signals/ConditionalTimer";
import { ConditionalTimerFeature as ConditionalTimerPulse } from "./features/pulse/ConditionalTimer";
import { TodosFeature as TodosReactNaive } from "./features/react-naive/Todos";
import { TodosFeature as TodosReactHooks } from "./features/react-hooks/Todos";
import { TodosFeature as TodosReactHooksContext } from "./features/react-hooks-context/Todos";
import { TodosFeature as TodosEasyPeasy } from "./features/easy-peasy/Todos";
import { TodosFeature as TodosJotai } from "./features/jotai/Todos";
import { TodosFeature as TodosMobx } from "./features/mobx/Todos";
import { TodosFeature as TodosSignals } from "./features/signals/Todos";
import { TodosFeature as TodosPulse } from "./features/pulse/Todos";
import "./App.css";

function App() {
  return (
    <>
      <div className="library-group">
        <TimerReactNaive />
        <ConditionalTimerReactNaive />
        <TodosReactNaive />
      </div>
      <div className="library-group">
        <TimerReactHooks />
        <ConditionalTimerReactHooks />
        <TodosReactHooks />
      </div>
      <div className="library-group">
        <TimerReactHooksContext />
        <ConditionalTimerReactHooksContext />
        <TodosReactHooksContext />
      </div>
      <div className="library-group">
        <TimerEasyPeasy />
        <ConditionalTimerEasyPeasy />
        <TodosEasyPeasy />
      </div>
      <div className="library-group">
        <TimerMobx />
        <ConditionalTimerMobx />
        <TodosMobx />
      </div>
      <div className="library-group">
        <TimerJotai />
        <ConditionalTimerJotai />
        <TodosJotai />
      </div>
      <div className="library-group">
        <TimerSignals />
        <ConditionalTimerSignals />
        <TodosSignals />
      </div>
      <div className="library-group">
        <TimerPulse />
        <ConditionalTimerPulse />
        <TodosPulse />
      </div>
    </>
  );
}

export default App;
