import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reminders } from "./Reminders";

const reminderHooksMock = vi.hoisted(() => {
  return {
    useReminders: vi.fn(),
    useAddReminder: vi.fn(),
  };
});

vi.mock("./hooks/useAddReminder.ts", () => {
  return {
    useAddReminder: reminderHooksMock.useAddReminder,
  };
});

vi.mock("./hooks/useReminders.ts", () => {
  return {
    useReminders: reminderHooksMock.useReminders,
  };
});

describe("Reminders (container)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render correctly while loading", () => {
    // arrange
    reminderHooksMock.useAddReminder.mockImplementation(() => ({
      addReminder: vi.fn(),
      isSaving: false,
      failedToAddReminderError: null,
    }));

    reminderHooksMock.useReminders.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      isLoading: true,
      isFetching: false,
      failedToFetchRemindersError: null,
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render correctly when failed to fetch reminders", () => {
    // arrange
    reminderHooksMock.useAddReminder.mockImplementation(() => ({
      addReminder: vi.fn(),
      isSaving: false,
      failedToAddReminderError: null,
    }));

    reminderHooksMock.useReminders.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      isLoading: false,
      isFetching: false,
      failedToFetchRemindersError: new Error("Service Unavailable"),
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText(/Service Unavailable/)).toBeInTheDocument();
  });

  it("should render correctly when failed to save reminder", () => {
    // arrange
    reminderHooksMock.useAddReminder.mockImplementation(() => ({
      addReminder: vi.fn(),
      isSaving: false,
      failedToAddReminderError: new Error("Service Unavailable"),
    }));

    reminderHooksMock.useReminders.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      isLoading: false,
      isFetching: false,
      failedToFetchRemindersError: null,
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText(/Service Unavailable/)).toBeInTheDocument();
  });

  it("should render correctly when reminders list is available", () => {
    // arrange
    reminderHooksMock.useAddReminder.mockImplementation(() => ({
      addReminder: vi.fn(),
      isSaving: false,
      failedToAddReminderError: null,
    }));

    reminderHooksMock.useReminders.mockImplementation(() => ({
      reminders: [
        { id: "1", text: "Buy milk" },
        { id: "2", text: "Paint house" },
      ],
      remindersCount: 2,
      isLoading: false,
      isFetching: false,
      failedToFetchRemindersError: null,
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText(/Buy milk/)).toBeInTheDocument();
    expect(screen.getByText(/Paint house/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it("should call handler with correct input when adding reminder", async () => {
    // arrange
    const addReminder = vi.fn();

    reminderHooksMock.useAddReminder.mockImplementation(() => ({
      addReminder,
      isSaving: false,
      failedToAddReminderError: null,
    }));

    reminderHooksMock.useReminders.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      isLoading: false,
      isFetching: false,
      failedToFetchRemindersError: null,
    }));

    render(<Reminders />);

    // act
    await userEvent.type(screen.getByLabelText("Remind me to"), "Paint house");
    await userEvent.type(screen.getByLabelText("Remind me to"), "{enter}");

    // assert
    expect(addReminder).toHaveBeenCalledWith("Paint house");
  });
});
