import {
  action,
  Action,
  effectOn,
  EffectOn,
  thunk,
  Thunk,
  Computed,
  computed,
  createStore,
} from "easy-peasy";

// Model interface
export interface ConditionalTimerModel {
  // State
  isOkay: boolean;
  isSafe: boolean;
  isCool: boolean;
  elapsedSeconds: number;

  // Computed
  isRunning: Computed<ConditionalTimerModel, boolean>;

  // Events
  toggledOkay: Action<ConditionalTimerModel>;
  toggledSafe: Action<ConditionalTimerModel>;
  toggledCool: Action<ConditionalTimerModel>;
  resettedTimer: Action<ConditionalTimerModel>;
  incrementedElapsedSeconds: Action<ConditionalTimerModel>;

  // Commands
  toggleOkay: Thunk<ConditionalTimerModel>;
  toggleSafe: Thunk<ConditionalTimerModel>;
  toggleCool: Thunk<ConditionalTimerModel>;
  resetTimer: Thunk<ConditionalTimerModel>;

  // Effects
  incrementTimerWhileRunning: EffectOn<
    ConditionalTimerModel,
    ConditionalTimerModel
  >;
}

// Model
export const model: ConditionalTimerModel = {
  // State
  isOkay: false,
  isSafe: false,
  isCool: false,
  elapsedSeconds: 0,

  // Computed
  isRunning: computed(
    (state) => state.isOkay && state.isSafe && state.isCool
  ),

  // Events
  toggledOkay: action((state) => {
    state.isOkay = !state.isOkay;
  }),
  toggledSafe: action((state) => {
    state.isSafe = !state.isSafe;
  }),
  toggledCool: action((state) => {
    state.isCool = !state.isCool;
  }),
  resettedTimer: action((state) => {
    state.elapsedSeconds = 0;
  }),
  incrementedElapsedSeconds: action((state) => {
    state.elapsedSeconds++
  }),

  // Effects
  incrementTimerWhileRunning: effectOn(
    [(state) => state.isRunning],
    (actions, change) => {
      const [isRunning] = change.current;

      if (!isRunning) {
        return;
      }
  
      const interval = setInterval(() => {
        actions.incrementedElapsedSeconds();
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
    }
  ),

  // Commands (public for consumption)
  toggleOkay: thunk(async (actions) => {
    actions.toggledOkay();
  }),
  toggleSafe: thunk(async (actions) => {
    actions.toggledSafe();
  }),
  toggleCool: thunk(async (actions) => {
    actions.toggledCool();
  }),
  resetTimer: thunk(async (actions) => {
    actions.resettedTimer();
  }),
}

// Model store instance
export const store = createStore(model);
