import { renderHook } from "@testing-library/react";
import { ModelsDependencies, useFiltersViewModel } from "./Filters.view-model";
import { signal } from "@preact/signals-core";
import { ModelsContext } from "../../providers/models.provider";

describe("useFiltersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const setSelectedOwnerId = vi.fn();

    const mockModels: ModelsDependencies = {
      usersModel: {
        users: signal([]),
      },
      selectedFiltersModel: {
        selectedOwnerId: signal(""),
        setSelectedOwnerId,
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsContext.Provider value={mockModels}>
        {children}
      </ModelsContext.Provider>
    );

    const { result } = renderHook(() => useFiltersViewModel(), { wrapper });

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
