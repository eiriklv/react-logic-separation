import { atom, createStore } from "jotai";
import { atomEffect } from "jotai-effect";

// State
export const elapsedSecondsAtom = atom<number>(0);
export const isRunningAtom = atom<boolean>(false);

// Events
export const startedTimerAtom = atom<null, [], void>(null, (_get, set) => {
  set(isRunningAtom, true);
});

export const stoppedTimerAtom = atom<null, [], void>(null, (_get, set) => {
  set(isRunningAtom, false);
});

export const incrementedElapsedSecondsAtom = atom<null, [], void>(
  null,
  (_get, set) => {
    set(elapsedSecondsAtom, (value) => value + 1);
  }
);

// Commands
export const startTimerAtom = atom<null, [], Promise<void>>(
  null,
  async (_get, set) => {
    set(startedTimerAtom);
  }
);

export const stopTimerAtom = atom<null, [], Promise<void>>(
  null,
  async (_get, set) => {
    set(stoppedTimerAtom);
  }
);

// Effects
export const incrementTimerWhileRunningAtom = atomEffect((get, set) => {
  const isRunning = get(isRunningAtom);

  if (!isRunning) {
    return () => {};
  }

  const interval = setInterval(() => {
    set(incrementedElapsedSecondsAtom);
  }, 1000);

  return () => {
    clearInterval(interval);
  };
});

// Model store instance
export const store = createStore();
