import { QueryClient, QueryClientConfig } from "@tanstack/query-core";

export function createQueryClient(config?: QueryClientConfig) {
  return new QueryClient(config);
}
