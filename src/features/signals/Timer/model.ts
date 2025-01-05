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
  incrementedElapsedSeconds = () => {
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
    const isRunning = this.isRunning.value;

    if (!isRunning) {
      return () => {};
    }

    const interval = setInterval(() => {
      this.incrementedElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
}

// Model instance
export const model = new TimerModel();
