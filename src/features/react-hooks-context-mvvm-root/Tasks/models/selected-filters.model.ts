import { useCallback, useState } from "react";
import { useStableEnvelope } from "../../../../lib/use-stable-envelope";

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

  return useStableEnvelope({
    selectedOwnerId,
    setSelectedOwnerId,
  });
}
