import type { Map as MaplibreMap } from "maplibre-gl";
import { LAYER_IDS } from "./layers";

/**
 * Map interaction handlers.
 * Phase A: stubs only. Wired in Phase C/D.
 */

export function setupParcelClickHandler(
  _map: MaplibreMap,
  _onParcelSelect: (parcelId: string) => void,
): () => void {
  // Phase D: wire parcel click → onParcelSelect
  return () => {};
}

export function setupParcelHoverHandler(_map: MaplibreMap): () => void {
  // Phase D: wire parcel hover cursor change
  return () => {};
}

export function highlightSelectedParcel(_map: MaplibreMap, _parcelId: string | null): void {
  // Phase D: set feature-state on LAYER_IDS.PARCEL_FILL
  void LAYER_IDS.PARCEL_SELECTED;
}
