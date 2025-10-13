import { signal } from "@preact/signals-core";
import { useSignalValue } from "./use-signal-value";
import { act, renderHook, waitFor } from "@testing-library/react";

describe(useSignalValue.name, () => {
  it("should reflect value from provided signal and handle updates", async () => {
    const mySignal = signal("initial value");

    const { result } = renderHook(() => useSignalValue(mySignal));

    await waitFor(() => expect(result.current).toEqual("initial value"));

    act(() => {
      mySignal.value = "updated value";
    });

    await waitFor(() => expect(result.current).toEqual("updated value"));
  });
});
