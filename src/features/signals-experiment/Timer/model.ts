import { computed, signal } from "@preact/signals-core";
import { relay } from "../../../lib/signals";

// Model
export class TimerModel {
  // State
  private _isRunning = signal<boolean>(false);

  // Relays (based on: https://www.pzuraq.com/blog/on-signal-relays)
  private _elapsedSeconds = relay<number>(0, (set, get) => {
    const isRunning = this._isRunning.value;

    if (!isRunning) {
      return () => {};
    }

    const interval = setInterval(() => {
      set(get() + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // Events (the only way to change the state of signals)
  private _startedTimer = () => {
    this._isRunning.value = true;
  };
  private _stoppedTimer = () => {
    this._isRunning.value = false;
  };
  private _resettedTimer = () => {
    this._elapsedSeconds.value = 0;
  };

  // Read-only state (public for consumption)
  readonly isRunning = computed(() => this._isRunning.value);
  readonly elapsedSeconds = computed(() => this._elapsedSeconds.value);

  // Commands (public for consumption)
  startTimer = async () => {
    this._startedTimer();
  };
  stopTimer = async () => {
    this._stoppedTimer();
  };
  resetTimer = async () => {
    this._resettedTimer();
  };
}

// Model instance
export const model = new TimerModel();
