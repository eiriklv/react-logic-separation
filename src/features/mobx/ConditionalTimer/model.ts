import { autorun, reaction, makeAutoObservable } from "mobx";

// Model
export class ConditionalTimerModel {
  constructor() {
    // Mobx magic...
    makeAutoObservable(this);

    // Effects
    this._disposeIncrementTimerWhileRunning = autorun(() => {
      const isRunning = this._isRunning;

      if (!isRunning) {
        return;
      }

      const interval = setInterval(() => {
        this._incrementedElapsedSeconds();
      }, 1000);

      reaction(
        () => this._isRunning, // Doesn't work if you use "isRunning"
        () => {
          clearInterval(interval);
        },
      );
    });
  }

  // State
  private _isOkay: boolean = false;
  private _isSafe: boolean = false;
  private _isCool: boolean = false;
  private _elapsedSeconds: number = 0;

  // Computed
  get _isRunning() {
    return this._isOkay && this._isSafe && this._isCool;
  }

  // Events
  private _toggledOkay = () => {
    this._isOkay = !this._isOkay;
  };

  private _toggledSafe = () => {
    this._isSafe = !this._isSafe;
  };

  private _toggledCool = () => {
    this._isCool = !this._isCool;
  };

  private _resettedTimer = () => {
    this._elapsedSeconds = 0;
  };

  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds = this._elapsedSeconds + 1;
  };

  // Effects
  private _disposeIncrementTimerWhileRunning: () => void;

  // Getters
  public get isOkay(): boolean {
    return this._isOkay;
  }

  public get isSafe(): boolean {
    return this._isSafe;
  }

  public get isCool(): boolean {
    return this._isCool;
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get elapsedSeconds(): number {
    return this._elapsedSeconds;
  }

  // Commands
  public toggleOkay = async () => {
    this._toggledOkay();
  };
  public toggleSafe = async () => {
    this._toggledSafe();
  };
  public toggleCool = async () => {
    this._toggledCool();
  };
  public resetTimer = async () => {
    this._resettedTimer();
  };

  // Disposal
  public dispose() {
    this._disposeIncrementTimerWhileRunning();
  }
}

// Model singleton
export const model = new ConditionalTimerModel();
