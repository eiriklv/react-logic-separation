import { renderHook } from "@testing-library/react";
import {
  CommandsContext,
  CommandsContextInterface,
  useCommands,
} from "./commands.provider";

describe("useCommands", () => {
  it("should work if commands are provided", async () => {
    // arrange
    const commands: CommandsContextInterface = {
      addTaskCommand: vi.fn(),
      deleteTaskCommand: vi.fn(),
      getUserCommand: vi.fn(),
      listTasksCommand: vi.fn(),
      listUsersCommand: vi.fn(),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <CommandsContext.Provider value={commands}>
        {children}
      </CommandsContext.Provider>
    );

    const { result } = renderHook(() => useCommands(), { wrapper });

    expect(result.current).toEqual(commands);
  });

  it("should fail if commands are not provided", async () => {
    // arrange
    expect(() => renderHook(() => useCommands())).toThrowError();
  });
});
