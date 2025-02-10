import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Reminders } from "./Reminders";

const queryClient = new QueryClient();

export function RemindersFeature() {
  return (
    <QueryClientProvider client={queryClient}>
      <Reminders />
    </QueryClientProvider>
  );
}
