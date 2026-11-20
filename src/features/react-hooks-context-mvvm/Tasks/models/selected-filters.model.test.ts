import { renderHook } from "@testing-library/react";
import { useSelectedFiltersModel } from "./selected-filters.model";

describe("SelectedFiltersModel", () => {
  it("should reflect current selected owner id and handle updates to it", async () => {
    // arrange
    const { result: { current: model } } = renderHook(() => useSelectedFiltersModel());

    // check that the category is empty initially
    expect(model.selectedOwnerId).toEqual("");

    // set the selected category to something else
    model.setSelectedOwnerId("user-1");

    // check that the category change is reflected
    expect(model.selectedOwnerId).toEqual("user-1");
  });
});
