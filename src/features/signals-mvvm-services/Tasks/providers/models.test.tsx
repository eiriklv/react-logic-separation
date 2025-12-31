import { renderHook } from "@testing-library/react";
import { ModelsProvider } from "./models.provider";
import { ModelsContextInterface } from "./models.context";
import { useModels } from "./models";

describe("useModels", () => {
  it("should work if models are provided", async () => {
    // arrange
    const models = {} as ModelsContextInterface;

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsProvider models={models}>{children}</ModelsProvider>
    );

    const { result } = renderHook(() => useModels(), { wrapper });

    expect(result.current).toBe(models);
  });

  it("should fail if models are not provided", async () => {
    // arrange
    expect(() => renderHook(() => useModels())).toThrowError();
  });
});
