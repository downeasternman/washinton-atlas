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

const GIS_LOT_SUFFIX_RE =
  /-(?:00[A-Z]|UIL|UI2|UI3|UB|MHL|PAR|BOL|MH)(?:-\d+)?$/i;

/**
 * Map-lot strings to try when joining geometry to commitment-book rows.
 */
export function mapLotJoinCandidates(mapLot: string | null | undefined): string[] {
  const normalized = normalizeMapBkLot(mapLot);
  if (!normalized) return [];

  const candidates: string[] = [normalized];
  let cur = normalized;

  while (GIS_LOT_SUFFIX_RE.test(cur)) {
    const next = cur.replace(GIS_LOT_SUFFIX_RE, "");
    if (!next || next === cur) break;
    candidates.push(next);
    cur = next;
  }

  while (cur.includes("-")) {
    const lastDash = cur.lastIndexOf("-");
    const parent = cur.slice(0, lastDash);
    if (!parent || parent === cur) break;
    candidates.push(parent);
    cur = parent;
  }

  return [...new Set(candidates)];
}

export function organizedMapJoinKey(geocode: string, mapLot: string | null): string | null {
  const normalized = normalizeMapBkLot(mapLot);
  if (!normalized) return null;
  return `${geocode}|${normalized}`;
}
