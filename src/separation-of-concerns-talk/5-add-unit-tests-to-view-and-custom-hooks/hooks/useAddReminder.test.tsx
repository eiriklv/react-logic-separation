import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useAddReminder } from "./useAddReminder";

const remindersServiceMock = vi.hoisted(() => {
  return {
    fetchReminders: vi.fn(),
    addReminder: vi.fn(),
  };
});

vi.mock("../services/reminders.service.ts", () => {
  return {
    fetchReminders: remindersServiceMock.fetchReminders,
    addReminder: remindersServiceMock.addReminder,
  };
});

describe("useAddReminder", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should expose error when saving reminder fails", async () => {
    // arrange
    const addReminderErrorMock = new Error("Service Unavailable");

    remindersServiceMock.addReminder.mockImplementation(async () => {
      throw addReminderErrorMock;
    });

    const queryClient = new QueryClient();

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddReminder(), { wrapper });

    // check that the failed to fetch error is exposes at some point
    await waitFor(() =>
      expect(() => result.current.addReminder("Wash car")).rejects.toThrowError(
        addReminderErrorMock,
      ),
    );

    // check that the error is available through the model
    expect(result.current.failedToAddReminderError).toEqual(
      addReminderErrorMock,
    );

    // check that the underlying service was called only once
    expect(remindersServiceMock.addReminder).toHaveBeenCalledOnce();
  });
});
