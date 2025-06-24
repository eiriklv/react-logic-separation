import { renderHook } from "@testing-library/react";
import { useFiltersViewModel } from "./Filters.view-model";
import { signal } from "@preact/signals-core";
import { FiltersViewModelContext } from "./Filters.view-model.context";
import {
  FiltersViewModelDependencies,
  ModelsDependencies,
} from "./Filters.view-model.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Filters.view-model.dependencies", () => ({ default: {} }));

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

    const dependencies: FiltersViewModelDependencies = {
      useModels: vi.fn(() => mockModels),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <FiltersViewModelContext.Provider value={dependencies}>
        {children}
      </FiltersViewModelContext.Provider>
    );

    const { result } = renderHook(() => useFiltersViewModel(), { wrapper });

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
