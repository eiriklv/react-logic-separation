import { batch, computed, effect, Signal, signal } from "@preact/signals-core";
import { derived } from "./signals";
import { QueryClient, QueryCache, QueryObserver } from "@tanstack/query-core";

/**
 * Create query client and cache
 */
export const queryClient: QueryClient = new QueryClient();
export const queryCache: QueryCache = queryClient.getQueryCache();

/**
 * Mount query client
 */
queryClient.mount();

/**
 * NOTE: This is fake for now
 * (does not do any caching, but emulates a simple query interface)
 */
export type QueryConfig<T> = {
  queryKey: string[];
  queryFn: () => Promise<T>;
};

export function query<T>(getQueryConfig: () => QueryConfig<T>) {
  const queryConfig = computed(() => getQueryConfig());
  const queryObserver = computed(
    () => new QueryObserver(queryClient, queryConfig.value),
  );

  const data: Signal<T | undefined> = signal(undefined);
  const isLoading: Signal<boolean> = signal(false);
  const isPending: Signal<boolean> = signal(false);
  const error: Signal<unknown> = signal(null);

  effect(() => {
    const disposeQuerySubscription = queryObserver.value.subscribe((result) => {
      batch(() => {
        data.value = result.data;
        isLoading.value = result.isLoading;
        isPending.value = result.isPending;
        error.value = result.error;
      });
    });

    return () => {
      disposeQuerySubscription();
    };
  });

  return { data, isLoading, isPending, error };
}

/**
 * NOTE: This is fake for now
 * (does not do any cache invalidation, but emulates a simple mutation interface)
 */
export type MutationConfig<T> = {
  queryKey: string[];
  mutationFn: () => Promise<T>;
};

export function mutation<T>(getMutationConfig: () => MutationConfig<T>) {
  const mutationConfig = computed(() => getMutationConfig());
  return derived(() => mutationConfig.value.mutationFn());
}
