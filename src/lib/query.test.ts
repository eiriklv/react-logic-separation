import { signal } from "@preact/signals-core";
import { query, mutation } from "./query";
import { sleep } from "./utils";
import { QueryClient } from "@tanstack/query-core";

describe("query", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should initialize and resolve correctly (promise)", async () => {
    const queryClient = new QueryClient();

    const myQuery = query(
      () => ({
        queryKey: ["abc"],
        queryFn: () => Promise.resolve(10),
      }),
      queryClient,
    );

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);
  });

  it("should initialize and resolve correctly (async)", async () => {
    const queryClient = new QueryClient();

    const myQuery = query(
      () => ({
        queryKey: ["abc"],
        queryFn: async () => 10,
      }),
      queryClient,
    );

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);
  });

  it("should update according to dependencies", async () => {
    const queryClient = new QueryClient();

    const mySignal1 = signal("a");
    const mySignal2 = signal(10);

    const myQuery = query(
      () => ({
        queryKey: [`abc-${mySignal1.value}`],
        queryFn: async () => mySignal2.value,
      }),
      queryClient,
    );

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    // This changes the query function
    mySignal2.value = 20;

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(20);
    expect(myQuery.error.value).toEqual(null);

    // This changes the cache key
    mySignal1.value = "b";

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(20);
    expect(myQuery.error.value).toEqual(null);
  });
});

describe("mutation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should trigger re-fetching of query when mutation invalidates cache", async () => {
    const queryClient = new QueryClient();

    let count = 10;
    const getNextCount = () => count++;

    const queryKey = ["abc"];

    const myQuery = query(
      () => ({
        queryKey,
        queryFn: async () => {
          await sleep(100);
          return getNextCount();
        },
      }),
      queryClient,
    );

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    const myMutation = mutation(
      () => ({
        mutationFn: async () => {
          await sleep(100);
          return 50;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      }),
      queryClient,
    );

    const resultPromise = myMutation.mutate();

    expect(myMutation.isSuccess.value).toBe(false);
    expect(myMutation.isPending.value).toBe(true);
    expect(myMutation.data.value).toEqual(undefined);
    expect(myMutation.error.value).toEqual(null);

    expect(myQuery.isFetching.value).toBe(false);
    expect(myQuery.isSuccess.value).toBe(true);
    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myMutation.isSuccess.value).toBe(true);
    expect(myMutation.isPending.value).toBe(false);
    expect(myMutation.data.value).toEqual(50);
    expect(myMutation.error.value).toEqual(null);

    const result = await resultPromise;
    expect(result).toEqual(50);

    expect(myQuery.isFetching.value).toBe(true);
    expect(myQuery.isSuccess.value).toBe(true);
    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myMutation.isSuccess.value).toBe(true);
    expect(myMutation.isPending.value).toBe(false);
    expect(myMutation.data.value).toEqual(50);
    expect(myMutation.error.value).toEqual(null);

    expect(myQuery.isFetching.value).toBe(false);
    expect(myQuery.isSuccess.value).toBe(true);
    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(11);
    expect(myQuery.error.value).toEqual(null);
  });
});
