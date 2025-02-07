import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TimerViewModelContextInterface,
  TimerViewModelContext,
} from "./Timer.viewmodel.context";
import { useTimerViewModel } from "./Timer.viewmodel";
import { signal } from "@preact/signals-core";
import type { PartialDeep } from "type-fest";

describe("useTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockDependencies: PartialDeep<TimerViewModelContextInterface> = {
      timerModel: {
        elapsedSeconds: signal(0),
        isRunning: signal(true),
        startTimer: vi.fn(),
        stopTimer: vi.fn(),
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TimerViewModelContext.Provider
        value={mockDependencies as TimerViewModelContextInterface}
      >
        {children}
      </TimerViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTimerViewModel(), { wrapper });

    // assert
    expect(result.current.elapsedSeconds).toEqual(
      mockDependencies.timerModel?.elapsedSeconds?.value,
    );
    expect(result.current.isRunning).toEqual(
      mockDependencies.timerModel?.isRunning?.value,
    );
    expect(result.current.startTimer).toEqual(
      mockDependencies.timerModel?.startTimer,
    );
    expect(result.current.stopTimer).toEqual(
      mockDependencies.timerModel?.stopTimer,
    );
  });
});
