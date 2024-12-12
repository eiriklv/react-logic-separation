import {
  createStore,
  action,
  Action,
  effectOn,
  EffectOn,
  thunk,
  Thunk,
} from "easy-peasy";

// Dependencies to be injected
const injections = {
  
};

// Types and interfaces
export type Injections = typeof injections;

// Model interface
export interface TimerModel {
  // State
  elapsedSeconds: number;
  isRunning: boolean;
  
  // Events
  startedTimer: Action<TimerModel>;
  stoppedTimer: Action<TimerModel>;
  incrementedElapsedSeconds: Action<TimerModel>;
  
  // Commands
  startTimer: Thunk<TimerModel, undefined, Injections>
  stopTimer: Thunk<TimerModel, undefined, Injections>;

  // Effects
  incrementTimerWhileRunning: EffectOn<TimerModel, TimerModel, Injections>;
}

// Model implementation
export const model: TimerModel = {
  elapsedSeconds: 0,
  isRunning: false,
  startedTimer: action((state) => {
    state.isRunning = true;
  }),
  stoppedTimer: action((state) => {
    state.isRunning = false;
  }),
  startTimer: thunk(async (actions) => {
    actions.startedTimer();
  }),
  stopTimer: thunk(async (actions) => {
    actions.stoppedTimer();
  }),
  incrementedElapsedSeconds: action((state) => {
    state.elapsedSeconds++;
  }),
  incrementTimerWhileRunning: effectOn(
    [(state) => state.isRunning],
    (actions, change) => {
      const [isRunning] = change.current;

      if (!isRunning) {
        return () => {}
      }

      const interval = setInterval(() => {
        actions.incrementedElapsedSeconds();
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }
  )
};

// Model store instance (with dependencies injected)
export const store = createStore(model, { injections });
