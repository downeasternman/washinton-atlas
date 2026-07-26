import { normalizeMapBkLot, organizedMapJoinKey } from "./map-lot-normalize";

export interface ParsedCommitmentRow {
  accountNumber: string;
  mapJoinKey: string;
  mapLot: string;
  ownerName: string | null;
  mailAddress: string | null;
  assessedLandValue: string | null;
  assessedBuildingValue: string | null;
  assessedTotalValue: string | null;
  taxYear: number | null;
  parseConfidence: number;
  attrsRaw: Record<string, unknown>;
}

const MAP_LOT_LINE_RE =
  /^\s*(\d{2,3}-\d{2,3}(?:-\d{2,3})?(?:-[A-Z][A-Z0-9-]*)?)\s*$/gim;

const ACCOUNT_VALUES_RE =
  /^(\d+)\s+(.+?)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$/gm;

function cleanMoney(value: string | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replace(/,/g, "").trim();
  return cleaned || null;
}

function extractOwnerFromAccountTail(tail: string): string | null {
  const trimmed = tail.trim();
  if (!trimmed) return null;
  const moneyIdx = trimmed.search(/\s[\d,]{2,}\s/);
  if (moneyIdx <= 0) return trimmed.slice(0, 80).trim() || null;
  return trimmed.slice(0, moneyIdx).trim() || null;
}

/**
 * Parse MRS-style town Real Estate Tax Commitment Book text.
 */
export function parseCommitmentText(
  text: string,
  geocode: string,
  taxYear: number | null,
): ParsedCommitmentRow[] {
  const rows: ParsedCommitmentRow[] = [];
  const seen = new Set<string>();

  const mapLotMatches = [...text.matchAll(MAP_LOT_LINE_RE)];
  for (const match of mapLotMatches) {
    const mapLotRaw = match[1];
    const normalized = normalizeMapBkLot(mapLotRaw);
    if (!normalized) continue;

    const mapJoinKey = organizedMapJoinKey(geocode, normalized);
    if (!mapJoinKey || seen.has(mapJoinKey)) continue;

    const start = Math.max(0, (match.index ?? 0) - 1200);
    const block = text.slice(start, match.index ?? 0);
    const accountMatch = [...block.matchAll(ACCOUNT_VALUES_RE)].pop();
    if (!accountMatch) continue;

    const accountNumber = accountMatch[1]!;
    const ownerName = extractOwnerFromAccountTail(accountMatch[2] ?? "");
    const land = cleanMoney(accountMatch[3]);
    const building = cleanMoney(accountMatch[4]);
    const assessment = cleanMoney(accountMatch[6]);

    let parseConfidence = 0.5;
    if (ownerName && normalized) parseConfidence = 0.8;
    if (ownerName && normalized && assessment) parseConfidence = 0.9;

    seen.add(mapJoinKey);
    rows.push({
      accountNumber,
      mapJoinKey,
      mapLot: normalized,
      ownerName,
      mailAddress: null,
      assessedLandValue: land,
      assessedBuildingValue: building,
      assessedTotalValue: assessment,
      taxYear,
      parseConfidence,
      attrsRaw: {
        mapLotRaw,
        accountLine: accountMatch[0]?.trim() ?? null,
      },
    });
  }

  return rows;
}
