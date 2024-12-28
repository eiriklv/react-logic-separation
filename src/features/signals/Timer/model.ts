import { effect, signal } from "@preact/signals-core";

// Model
export class TimerModel {
  // State
  elapsedSeconds = signal<number>(0);
  isRunning = signal<boolean>(false);

  // Events
  startedTimer = () => {
    this.isRunning.value = true;
  };
  stoppedTimer = () => {
    this.isRunning.value = false;
  };
  incrementElapsedSeconds = () => {
    this.elapsedSeconds.value = this.elapsedSeconds.value + 1;
  };

  // Commands
  startTimer = async () => {
    this.startedTimer();
  };
  stopTimer = async () => {
    this.stoppedTimer();
  };

  // Effects
  incrementTimerWhileRunning = effect(() => {
    // Get dependencies that triggered the effect
    const isRunningValue = this.isRunning.value;

    if (!isRunningValue) {
      return () => {};
    }

    const interval = setInterval(() => {
      this.incrementElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
}

export function createStore() {
  return new TimerModel();
}

export const store = createStore();
