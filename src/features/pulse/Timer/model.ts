import { effect, signal, computed } from "@cognite/pulse";

// Model
export class TimerModel {
  // State
  private _elapsedSeconds = signal<number>(0);
  private _isRunning = signal<boolean>(false);

  // Events
  private _startedTimer = () => {
    this._isRunning(true);
  };
  private _stoppedTimer = () => {
    this._isRunning(false);
  };
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds(this._elapsedSeconds() + 1);
  };

  // Effects
  private _disposeIncrementTimerWhileRunning = effect(() => {
    // Get dependencies that triggered the effect
    const isRunning = this._isRunning();

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
    return computed(() => this._elapsedSeconds());
  }
  public get isRunning() {
    return computed(() => this._isRunning());
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
