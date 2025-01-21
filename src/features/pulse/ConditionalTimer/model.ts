import { computed, effect, ReadonlySignal, signal } from "@cognite/pulse";

// Model
export class ConditionalTimerModel {
  // State
  private _isOkay = signal<boolean>(false);
  private _isSafe = signal<boolean>(false);
  private _isCool = signal<boolean>(false);
  private _elapsedSeconds = signal<number>(0);

  // Computed
  private _isRunning = computed(
    () => this._isOkay() && this._isSafe() && this._isCool(),
  );

  // Effects
  private _disposeIncrementTimerWhileRunning = effect(() => {
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

  // Events
  private _toggledOkay = () => {
    this._isOkay(!this._isOkay());
  };
  private _toggledSafe = () => {
    this._isSafe(!this._isSafe());
  };
  private _toggledCool = () => {
    this._isCool(!this._isCool());
  };
  private _resettedTimer = () => {
    this._elapsedSeconds(0);
  };
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds(this._elapsedSeconds() + 1);
  };

  // Readonly signals
  public get isOkay(): ReadonlySignal<boolean> {
    return this._isOkay;
  }
  public get isSafe(): ReadonlySignal<boolean> {
    return this._isSafe;
  }
  public get isCool(): ReadonlySignal<boolean> {
    return this._isCool;
  }
  public get elapsedSeconds(): ReadonlySignal<number> {
    return this._elapsedSeconds;
  }
  public get isRunning(): ReadonlySignal<boolean> {
    return this._isRunning;
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
