import { computed, effect, signal } from "@preact/signals-core";

// Model
export class TimerModel {
  // State
  private _elapsedSeconds = signal<number>(0);
  private _isRunning = signal<boolean>(false);

  // Events
  private _startedTimer = () => {
    this._isRunning.value = true;
  };
  private _stoppedTimer = () => {
    this._isRunning.value = false;
  };
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds.value = this._elapsedSeconds.value + 1;
  };

  // Effects
  private _disposeIncrementTimerWhileRunning = effect(() => {
    // Get dependencies that triggered the effect
    const isRunning = this._isRunning.value;

    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      this._incrementedElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // Readonly signals
  public get elapsedSeconds() {
    return computed(() => this._elapsedSeconds.value);
  }
  public get isRunning() {
    return computed(() => this._isRunning.value);
  }

  // Commands
  public startTimer = async () => {
    this._startedTimer();
  };
  public stopTimer = async () => {
    this._stoppedTimer();
  };

  // Disposal
  public dispose() {
    this._disposeIncrementTimerWhileRunning();
  }
}

// Model singleton
export const model = new TimerModel();
