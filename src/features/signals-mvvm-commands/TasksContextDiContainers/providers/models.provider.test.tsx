import { renderHook } from "@testing-library/react";
import {
  ModelsContext,
  ModelsContextInterface,
  useModels,
} from "./models.provider";

describe("useModels", () => {
  it("should work if models are provided", async () => {
    // arrange
    const models = {} as ModelsContextInterface;

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsContext.Provider value={models}>{children}</ModelsContext.Provider>
    );

    const { result } = renderHook(() => useModels(), { wrapper });

    expect(result.current).toEqual(models);
  });

  it("should fail if models are not provided", async () => {
    // arrange
    expect(() => renderHook(() => useModels())).toThrowError();
  });
});
