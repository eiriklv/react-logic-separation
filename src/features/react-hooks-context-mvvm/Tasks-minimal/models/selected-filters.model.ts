import { useCallback, useState } from "react";

export interface ISelectedFiltersModel {
  selectedOwnerId: string;
  setSelectedOwnerId(newSelectedOwner: string): void;
}

export function useSelectedFiltersModel(): ISelectedFiltersModel {
  // State
  const [selectedOwnerId, _setSelectedOwnerId] = useState("");

  // Setters
  const setSelectedOwnerId = useCallback((newSelectedOwner: string) => {
    _setSelectedOwnerId(newSelectedOwner);
  }, []);

  return {
    selectedOwnerId,
    setSelectedOwnerId,
  };
}
