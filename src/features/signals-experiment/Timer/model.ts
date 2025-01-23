import { ReadonlySignal, signal } from "@preact/signals-core";
import { relay } from "../../../lib/signals";

// Model
export class TimerModel {
  // State
  private _isRunning = signal<boolean>(false);

  // Relays (based on: https://www.pzuraq.com/blog/on-signal-relays)
  private _elapsedSeconds = relay<number>(0, (set, get) => {
    const isRunning = this._isRunning.value;

    if (!isRunning) {
      return;
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

  // Read-only state (public for consumption)
  public get isRunning(): ReadonlySignal<boolean> {
    return this._isRunning;
  }
  public get elapsedSeconds(): ReadonlySignal<number> {
    return this._elapsedSeconds;
  }

  // Commands (public for consumption)
  public startTimer = async () => {
    this._startedTimer();
  };
  public stopTimer = async () => {
    this._stoppedTimer();
  };
}

// Model singleton
export const model = new TimerModel();
