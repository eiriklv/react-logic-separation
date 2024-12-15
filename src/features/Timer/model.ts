import {
  createStore,
  action,
  Action,
  effectOn,
  EffectOn,
  thunk,
  Thunk,
} from "easy-peasy";

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
  startTimer: Thunk<TimerModel>;
  stopTimer: Thunk<TimerModel>;

  // Effects
  incrementTimerWhileRunning: EffectOn<TimerModel, TimerModel>;
}

// Model implementation
export const model: TimerModel = {
  // State
  elapsedSeconds: 0,
  isRunning: false,

  // Events
  startedTimer: action((state) => {
    state.isRunning = true;
  }),
  stoppedTimer: action((state) => {
    state.isRunning = false;
  }),
  incrementedElapsedSeconds: action((state) => {
    state.elapsedSeconds++;
  }),

  // Commands
  startTimer: thunk(async (actions) => {
    actions.startedTimer();
  }),
  stopTimer: thunk(async (actions) => {
    actions.stoppedTimer();
  }),

  // Effects
  incrementTimerWhileRunning: effectOn(
    [(state) => state.isRunning],
    (actions, change) => {
      const [isRunning] = change.current;

      if (!isRunning) {
        return () => {};
      }

      const interval = setInterval(() => {
        actions.incrementedElapsedSeconds();
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  ),
};

// Model store instance
export const store = createStore(model);
