import { renderHook } from "@testing-library/react";
import { useSelectedFiltersModel } from "./selected-filters.model";
import { act } from "react";

describe("SelectedFiltersModel", () => {
  it("should reflect current selected owner id and handle updates to it", async () => {
    // arrange
    const { result } = renderHook(() => useSelectedFiltersModel());

    // check that the category is empty initially
    expect(result.current.selectedOwnerId).toEqual("");

    // set the selected category to something else
    act(() => {
      result.current.setSelectedOwnerId("user-1");
    });

    // check that the category change is reflected
    expect(result.current.selectedOwnerId).toEqual("user-1");
  });
});
