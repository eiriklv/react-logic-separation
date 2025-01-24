import { render, screen } from "@testing-library/react";
import { ReminderItem } from "./ReminderItem";
import { Reminder } from "../types";

describe("ReminderItem Component", () => {
  it("Renders correctly", () => {
    // arrange
    const reminder: Reminder = {
      id: "test",
      text: "Paint house",
    };

    render(<ReminderItem reminder={reminder} />);

    // assert
    expect(screen.getByText("Paint house")).toBeInTheDocument();
  });
});
