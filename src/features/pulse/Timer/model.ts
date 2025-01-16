import { effect, signal } from "@cognite/pulse";

// Model
export class TimerModel {
  // State
  elapsedSeconds = signal<number>(0);
  isRunning = signal<boolean>(false);

  // Events
  startedTimer = () => {
    this.isRunning(true);
  };
  stoppedTimer = () => {
    this.isRunning(false);
  };
  incrementedElapsedSeconds = () => {
    this.elapsedSeconds(this.elapsedSeconds() + 1);
  };

  // Effects
  incrementTimerWhileRunning = effect(() => {
    // Get dependencies that triggered the effect
    const isRunning = this.isRunning();

    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      this.incrementedElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // Commands
  startTimer = async () => {
    this.startedTimer();
  };
  stopTimer = async () => {
    this.stoppedTimer();
  };
}

// Model singleton
export const model = new TimerModel();
