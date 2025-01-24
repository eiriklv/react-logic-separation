import { autorun, reaction, makeAutoObservable } from "mobx";

// Model
export class TimerModel {
  constructor() {
    // Mobx magic...
    makeAutoObservable(this);

    // Effects
    this._disposeIncrementTimerWhileRunning = autorun(() => {
      // Get signal dependencies that triggered the effect
      const isRunning = this._isRunning;

      if (!isRunning) {
        return;
      }

      const interval = setInterval(() => {
        this._incrementedElapsedSeconds();
      }, 1000);

      reaction(
        () => this._isRunning,
        () => {
          clearInterval(interval);
        },
      );
    });
  }

  // State
  private _elapsedSeconds: number = 0;
  private _isRunning: boolean = false;

  // Events
  private _startedTimer = () => {
    this._isRunning = true;
  };

  private _stoppedTimer = () => {
    this._isRunning = false;
  };

  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds = this._elapsedSeconds + 1;
  };

  // Effects
  private _disposeIncrementTimerWhileRunning: () => void;

  // Getters
  public get elapsedSeconds(): number {
    return this._elapsedSeconds;
  }
  public get isRunning(): boolean {
    return this._isRunning;
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
