import { signal, useSignalValue } from "./solid-signals-wrapper";
import { act, renderHook, waitFor } from "@testing-library/react";

describe(useSignalValue, () => {
  it("should reflect value from provided signal and handle updates", async () => {
    const mySignal = signal("initial value");

    const { result } = renderHook(() => useSignalValue(mySignal));

    await waitFor(() => expect(result.current).toEqual("initial value"));

    act(() => {
      mySignal.set("updated value");
    });

    await waitFor(() => expect(result.current).toEqual("updated value"));
  });
});
