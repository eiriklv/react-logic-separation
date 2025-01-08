import { computed, effect, signal } from "@cognite/pulse";

// Model
export class ConditionalTimerModel {
  // State
  isOkay = signal<boolean>(false);
  isSafe = signal<boolean>(false);
  isCool = signal<boolean>(false);
  elapsedSeconds = signal<number>(0);

  // Computed
  isRunning = computed(
    () => this.isOkay() && this.isSafe() && this.isCool()
  );

  // Effects
  incrementTimerWhileRunning = effect(() => {
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

  // Events
  toggledOkay = () => {
    this.isOkay(!this.isOkay());
  };
  toggledSafe = () => {
    this.isSafe(!this.isSafe());
  };
  toggledCool = () => {
    this.isCool(!this.isCool());
  };
  resettedTimer = () => {
    this.elapsedSeconds(0);
  };
  incrementedElapsedSeconds = () => {
    this.elapsedSeconds(this.elapsedSeconds() + 1);
  };

  // Commands
  toggleOkay = async () => {
    this.toggledOkay();
  };
  toggleSafe = async () => {
    this.toggledSafe();
  };
  toggleCool = async () => {
    this.toggledCool();
  };
  resetTimer = async () => {
    this.resettedTimer();
  };
}

// Model instance
export const model = new ConditionalTimerModel();
