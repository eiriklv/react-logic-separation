import { renderHook } from "@testing-library/react";
import { useServices } from "./services";
import { ServicesContextInterface } from "./services.context";
import { ServicesProvider } from "./services.provider";

describe("useServices", () => {
  it("should work if services are provided", async () => {
    // arrange

    /**
     * NOTE(eiriklv): We don't actually care about the content
     * of the services object, we only care about the object/reference
     * itself. Therefore it is better avoid typing it out explicitly,
     * to make sure that the test only fails for useful reasons.
     */
    const services = {} as ServicesContextInterface;

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ServicesProvider services={services}>{children}</ServicesProvider>
    );

    // act
    const { result } = renderHook(() => useServices(), { wrapper });

    // assert
    expect(result.current).toBe(services);
  });

  it("should fail if services are not provided", async () => {
    expect(() => renderHook(() => useServices())).toThrowError();
  });
});
