import { ReadonlySignal, signal } from "@preact/signals-core";

export interface ISelectedFiltersModel {
  selectedOwnerId: ReadonlySignal<string>;
  setSelectedOwnerId(newSelectedOwner: string): void;
}

export class SelectedFiltersModel implements ISelectedFiltersModel {
  // State
  private _selectedOwnerId = signal<string>("");

  // Getters
  public get selectedOwnerId(): ReadonlySignal<string> {
    return this._selectedOwnerId;
  }

  // Commands
  public setSelectedOwnerId = (newSelectedOwner: string) => {
    this._selectedOwnerId.value = newSelectedOwner;
  };
}

// Model factory
export const createSelectedFiltersModel = (
  ...args: ConstructorParameters<typeof SelectedFiltersModel>
): ISelectedFiltersModel => new SelectedFiltersModel(...args);
