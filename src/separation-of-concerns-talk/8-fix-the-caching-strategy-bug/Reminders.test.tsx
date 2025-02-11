import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reminders } from "./Reminders";

const remindersModelMock = vi.hoisted(() => {
  return {
    useRemindersModel: vi.fn(),
  };
});

vi.mock("./models/reminders-model", () => {
  return {
    useRemindersModel: remindersModelMock.useRemindersModel,
  };
});

describe("Reminders (container)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render correctly while loading", () => {
    // arrange
    remindersModelMock.useRemindersModel.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      addReminder: vi.fn(),
      isLoading: true,
      isSaving: false,
      isFetching: false,
      failedToAddReminderError: null,
      failedToFetchRemindersError: null,
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render correctly when failed to fetch reminders", () => {
    // arrange
    remindersModelMock.useRemindersModel.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      addReminder: vi.fn(),
      isLoading: false,
      isSaving: false,
      isFetching: false,
      failedToAddReminderError: null,
      failedToFetchRemindersError: new Error("Service Unavailable"),
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText(/Service Unavailable/)).toBeInTheDocument();
  });

  it("should render correctly when failed to save reminder", () => {
    // arrange
    remindersModelMock.useRemindersModel.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      addReminder: vi.fn(),
      isLoading: false,
      isSaving: false,
      isFetching: false,
      failedToAddReminderError: new Error("Service Unavailable"),
      failedToFetchRemindersError: null,
    }));

    render(<Reminders />);

    // assert
    expect(screen.getByText(/Service Unavailable/)).toBeInTheDocument();
  });

  it("should render correctly when reminders list is available", () => {
    // arrange
    remindersModelMock.useRemindersModel.mockImplementation(() => ({
      reminders: [
        { id: "1", text: "Buy milk" },
        { id: "2", text: "Paint house" },
      ],
      remindersCount: 2,
      addReminder: vi.fn(),
      isLoading: false,
      isSaving: false,
      isFetching: false,
      failedToAddReminderError: null,
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

    remindersModelMock.useRemindersModel.mockImplementation(() => ({
      reminders: [],
      remindersCount: 0,
      addReminder,
      isLoading: false,
      isSaving: false,
      isFetching: false,
      failedToAddReminderError: null,
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
