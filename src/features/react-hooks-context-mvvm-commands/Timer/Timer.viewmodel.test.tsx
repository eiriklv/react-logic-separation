import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TimerViewModelContextInterface,
  TimerViewModelContext,
} from "./Timer.viewmodel.context";
import { useTimerViewModel } from "./Timer.viewmodel";

describe("useTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const timerModelReturnValue: ReturnType<
      TimerViewModelContextInterface["useTimerModel"]
    > = {
      elapsedSeconds: 0,
      isRunning: false,
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
    };

    const mockDependencies: TimerViewModelContextInterface = {
      useTimerModel: vi.fn(() => timerModelReturnValue),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TimerViewModelContext.Provider value={mockDependencies}>
        {children}
      </TimerViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTimerViewModel(), { wrapper });

    // assert
    expect(result.current.elapsedSeconds).toEqual(
      timerModelReturnValue.elapsedSeconds,
    );
    expect(result.current.isRunning).toEqual(timerModelReturnValue.isRunning);
    expect(result.current.startTimer).toEqual(timerModelReturnValue.startTimer);
    expect(result.current.stopTimer).toEqual(timerModelReturnValue.stopTimer);
  });
});
