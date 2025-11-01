import { createSelectedFiltersModel } from "./selected-filters.model";

describe("SelectedFiltersModel", () => {
  it("should reflect current selected owner id and handle updates to it", async () => {
    // arrange
    const model = createSelectedFiltersModel();

    // check that the category is empty initially
    expect(model.selectedOwnerId.value).toEqual("");

    // set the selected category to something else
    model.setSelectedOwnerId("user-1");

    // check that the category change is reflected
    expect(model.selectedOwnerId.value).toEqual("user-1");
  });
});
