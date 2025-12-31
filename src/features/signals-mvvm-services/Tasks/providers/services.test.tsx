import { renderHook } from "@testing-library/react";
import { useServices } from "./services";
import { ServicesContextInterface } from "./services.context";
import { ServicesProvider } from "./services.provider";

describe("useServices", () => {
  it("should work if services are provided", async () => {
    // arrange
    const services = {} as ServicesContextInterface;

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ServicesProvider services={services}>{children}</ServicesProvider>
    );

    const { result } = renderHook(() => useServices(), { wrapper });

    expect(result.current).toBe(services);
  });

  it("should fail if services are not provided", async () => {
    // arrange
    expect(() => renderHook(() => useServices())).toThrowError();
  });
});
