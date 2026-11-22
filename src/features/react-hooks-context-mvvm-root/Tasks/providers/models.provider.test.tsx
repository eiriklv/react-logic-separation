import { renderHook } from "@testing-library/react";
import {
  ModelsProvider,
  ModelsContextInterface,
  useModels,
} from "./models.provider";

describe("useModels", () => {
  it("should work if models are provided", async () => {
    // arrange

    /**
     * NOTE(eiriklv): We don't actually care about the content
     * of the models object, we only care about the object/reference
     * itself. Therefore it is better avoid typing it out explicitly,
     * to make sure that the test only fails for useful reasons.
     */
    const models = {} as ModelsContextInterface;

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsProvider value={models}>{children}</ModelsProvider>
    );

    // act
    const { result } = renderHook(() => useModels(), { wrapper });

    // assert
    expect(result.current).toBe(models);
  });

  it("should fail if models are not provided", async () => {
    expect(() => renderHook(() => useModels())).toThrowError();
  });
});
