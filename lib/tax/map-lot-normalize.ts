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

function padMapLotSegments(normalized: string): string | null {
  const parts = normalized.split("-");
  if (parts.length < 2 || parts.length > 4) return null;
  if (!parts.every((part) => /^\d+$/.test(part))) return null;
  return parts.map((part) => part.padStart(3, "0")).join("-");
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
  const padded = padMapLotSegments(normalized);
  if (padded) {
    candidates.push(padded);
    if (padded.split("-").length === 2) {
      candidates.push(`${padded}-000`);
    }
  }

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
