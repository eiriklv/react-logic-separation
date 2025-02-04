import { render, screen } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import { Todo } from "../model";

describe("TodoItem Component", () => {
  it("Renders correctly", () => {
    // arrange
    const todo: Todo = {
      id: "test",
      text: "Paint house",
    };

    render(<TodoItem todo={todo} />);

    // assert
    expect(screen.getByText("Paint house")).toBeInTheDocument();
  });
});
