import { useSignalValue } from "./use-signal-value-solid";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createSignal } from "@solidjs/signals";

describe(useSignalValue, () => {
  it("should reflect value from provided signal and handle updates", async () => {
    const [mySignal, setMySignal] = createSignal("initial value");

    const { result } = renderHook(() => useSignalValue(mySignal));

    await waitFor(() => expect(result.current).toEqual("initial value"));

    act(() => {
      setMySignal("updated value");
    });

    await waitFor(() => expect(result.current).toEqual("updated value"));
  });
});
