import { renderHook } from "@testing-library/react";
import React from "react";
import {
  ConditionalTimerViewModelContextInterface,
  ConditionalTimerViewModelContext,
} from "./ConditionalTimer.viewmodel.context";
import { useConditionalTimerViewModel } from "./ConditionalTimer.viewmodel";
import { signal } from "@preact/signals-core";
import type { PartialDeep } from "type-fest";

describe("useConditionalTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockDependencies: PartialDeep<ConditionalTimerViewModelContextInterface> =
      {
        conditionalTimerModel: {
          elapsedSeconds: signal(0),
          isRunning: signal(true),
          isOkay: signal(true),
          isSafe: signal(true),
          isCool: signal(true),
          toggleOkay: vi.fn(),
          toggleSafe: vi.fn(),
          toggleCool: vi.fn(),
          resetTimer: vi.fn(),
        },
      };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ConditionalTimerViewModelContext.Provider
        value={mockDependencies as ConditionalTimerViewModelContextInterface}
      >
        {children}
      </ConditionalTimerViewModelContext.Provider>
    );

    const { result } = renderHook(() => useConditionalTimerViewModel(), {
      wrapper,
    });

    // assert
    expect(result.current.elapsedSeconds).toEqual(
      mockDependencies.conditionalTimerModel?.elapsedSeconds?.value,
    );
    expect(result.current.isOkay).toEqual(
      mockDependencies.conditionalTimerModel?.isOkay?.value,
    );
    expect(result.current.isSafe).toEqual(
      mockDependencies.conditionalTimerModel?.isSafe?.value,
    );
    expect(result.current.isCool).toEqual(
      mockDependencies.conditionalTimerModel?.isCool?.value,
    );
    expect(result.current.isRunning).toEqual(
      mockDependencies.conditionalTimerModel?.isRunning?.value,
    );
    expect(result.current.toggleOkay).toEqual(
      mockDependencies.conditionalTimerModel?.toggleOkay,
    );
    expect(result.current.toggleSafe).toEqual(
      mockDependencies.conditionalTimerModel?.toggleSafe,
    );
    expect(result.current.toggleCool).toEqual(
      mockDependencies.conditionalTimerModel?.toggleCool,
    );
    expect(result.current.resetTimer).toEqual(
      mockDependencies.conditionalTimerModel?.resetTimer,
    );
  });
});
