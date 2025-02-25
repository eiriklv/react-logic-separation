import { ReadonlySignal, signal } from "@preact/signals-core";

export class SelectedCategoryModel {
  // State
  private _selectedCategory = signal<string>("");

  // Getters
  public get selectedCategory(): ReadonlySignal<string> {
    return this._selectedCategory;
  }

  // Commands
  public setSelectedCategory = async (newSelectedCategory: string) => {
    this._selectedCategory.value = newSelectedCategory;
  };
}

// Model singleton
export const selectedCategoryModel = new SelectedCategoryModel();
