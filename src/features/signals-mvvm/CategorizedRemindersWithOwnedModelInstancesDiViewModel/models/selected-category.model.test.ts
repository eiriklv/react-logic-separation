import { SelectedCategoryModel } from "./selected-category.model";

describe("SelectedCategoryModel", () => {
  it("should reflect current selected category and handle updates to it", async () => {
    // arrange
    const model = new SelectedCategoryModel();

    // check that the category is empty initially
    expect(model.selectedCategory.value).toEqual("");

    // set the selected category to something else
    model.setSelectedCategory("my-category");

    // check that the category change is reflected
    expect(model.selectedCategory.value).toEqual("my-category");
  });
});
