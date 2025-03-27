import { ReadonlySignal, signal } from "@preact/signals-core";

export class SelectedFiltersModel {
  // State
  private _selectedOwnerId = signal<string>("");

  // Getters
  public get selectedOwnerId(): ReadonlySignal<string> {
    return this._selectedOwnerId;
  }

  // Commands
  public setSelectedOwnerId = async (newSelectedOwner: string) => {
    this._selectedOwnerId.value = newSelectedOwner;
  };
}

// Model singleton
export const selectedFiltersModelSingleton = new SelectedFiltersModel();
