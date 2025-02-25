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

// Model factory
export const createSelectedCategoryModel = (
  ...args: ConstructorParameters<typeof SelectedCategoryModel>
) => new SelectedCategoryModel(...args);

// Model singleton
export const selectedCategoryModel = new SelectedCategoryModel();
