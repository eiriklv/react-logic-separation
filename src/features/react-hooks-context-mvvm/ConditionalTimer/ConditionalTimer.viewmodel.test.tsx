import { renderHook } from "@testing-library/react";
import React from "react";
import {
  ConditionalTimerViewModelContextInterface,
  ConditionalTimerViewModelContext,
} from "./ConditionalTimer.viewmodel.context";
import { useConditionalTimerViewModel } from "./ConditionalTimer.viewmodel";

describe("useConditionalTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const conditionalTimerModelReturnValue: ReturnType<
      ConditionalTimerViewModelContextInterface["useConditionalTimerModel"]
    > = {
      elapsedSeconds: 0,
      isRunning: false,
      isOkay: false,
      isSafe: false,
      isCool: false,
      toggleOkay: vi.fn(),
      toggleSafe: vi.fn(),
      toggleCool: vi.fn(),
      resetTimer: vi.fn(),
    };

    const mockDependencies: ConditionalTimerViewModelContextInterface = {
      useConditionalTimerModel: vi.fn(() => conditionalTimerModelReturnValue),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ConditionalTimerViewModelContext.Provider value={mockDependencies}>
        {children}
      </ConditionalTimerViewModelContext.Provider>
    );

    const { result } = renderHook(() => useConditionalTimerViewModel(), {
      wrapper,
    });

    // assert
    expect(result.current.elapsedSeconds).toEqual(
      conditionalTimerModelReturnValue.elapsedSeconds,
    );
    expect(result.current.isOkay).toEqual(
      conditionalTimerModelReturnValue.isOkay,
    );
    expect(result.current.isSafe).toEqual(
      conditionalTimerModelReturnValue.isSafe,
    );
    expect(result.current.isCool).toEqual(
      conditionalTimerModelReturnValue.isCool,
    );
    expect(result.current.isRunning).toEqual(
      conditionalTimerModelReturnValue.isRunning,
    );
    expect(result.current.toggleOkay).toEqual(
      conditionalTimerModelReturnValue.toggleOkay,
    );
    expect(result.current.toggleSafe).toEqual(
      conditionalTimerModelReturnValue.toggleSafe,
    );
    expect(result.current.toggleCool).toEqual(
      conditionalTimerModelReturnValue.toggleCool,
    );
    expect(result.current.resetTimer).toEqual(
      conditionalTimerModelReturnValue.resetTimer,
    );
  });
});
