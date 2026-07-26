/**
 * Normalize organized-town MAP_BK_LOT / commitment-book map-lot strings for joins.
 */
export function normalizeMapBkLot(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let normalized = raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!normalized) return null;

  // GeoLibrary often pads lots as ###-###-000 while commitment books omit trailing -000.
  if (/-000$/.test(normalized)) {
    normalized = normalized.replace(/-000$/, "");
  }

  return normalized || null;
}

export function organizedMapJoinKey(geocode: string, mapLot: string | null): string | null {
  const normalized = normalizeMapBkLot(mapLot);
  if (!normalized) return null;
  return `${geocode}|${normalized}`;
}
