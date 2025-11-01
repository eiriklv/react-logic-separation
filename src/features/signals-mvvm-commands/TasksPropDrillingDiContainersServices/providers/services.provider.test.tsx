import { renderHook } from "@testing-library/react";
import {
  ServicesContext,
  ServicesContextInterface,
  useServices,
} from "./services.provider";

describe("useServices", () => {
  it("should work if services are provided", async () => {
    // arrange
    const services = {} as ServicesContextInterface;

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ServicesContext.Provider value={services}>
        {children}
      </ServicesContext.Provider>
    );

    const { result } = renderHook(() => useServices(), { wrapper });

    expect(result.current).toBe(services);
  });

  it("should fail if services are not provided", async () => {
    // arrange
    expect(() => renderHook(() => useServices())).toThrowError();
  });
});
