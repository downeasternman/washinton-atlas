import { isSubtotalLine, preprocessCommitmentText } from "./commitment-preprocess";
import { sanitizeOwnerName } from "./owner-normalize";
import {
  hasPersonOrEntitySignal,
  isValidMoney,
  isValidOwnerName,
} from "./owner-validate";
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
  /^\s*((?:\d{2,3}-\d{2,3}(?:-\d{2,3})?(?:-[A-Z][A-Z0-9-]*)?)|(?:[A-Z]\d-0[A-Z]\d-[A-Z0-9]+(?:\/[A-Z0-9]+)?))\s*$/i;

const DEED_REF_RE = /^B\d+/i;
const MONEY_TOKEN_RE = /^[\d,]+(?:\.\d+)?$/;

interface AccountBlock {
  accountNumber: string;
  headerLine: string;
  headerRest: string;
  ownerRaw: string | null;
  headerLand: string | null;
  headerBuilding: string | null;
  headerExempt: string | null;
  headerAssessment: string | null;
  mailLines: string[];
  bodyLines: string[];
}

interface LotValues {
  land: string | null;
  building: string | null;
  exempt: string | null;
  assessment: string | null;
  source: string;
}

function cleanMoney(value: string | undefined | null): string | null {
  if (!value) return null;
  const cleaned = value.replace(/,/g, "").replace(/\s/g, "").trim();
  return cleaned || null;
}

function parseMoneyToken(value: string): string | null {
  const cleaned = cleanMoney(value);
  if (!cleaned || !MONEY_TOKEN_RE.test(value.trim())) return null;
  return cleaned;
}

function isStreetOnly(text: string): boolean {
  const upper = text.toUpperCase();
  const hasStreet =
    /\b(ROAD|RD|ST|STREET|LN|LANE|DRIVE|DR|AVE|COVE|WAY|AVENUE|CIRCLE|COURT|PLACE|TRAIL|BOULEVARD|ROUTE|POINT)\b/.test(
      upper,
    );
  const hasPersonOrEntity = hasPersonOrEntitySignal(text);
  return hasStreet && !hasPersonOrEntity;
}

function isValidAccountHeader(_accountNumber: string, rest: string): boolean {
  const trimmed = rest.trim();
  if (!trimmed || !/^[A-Z0-9]/.test(trimmed)) return false;
  if (isStreetOnly(trimmed)) return false;
  if (/acres/i.test(trimmed) && !/,/.test(trimmed)) return false;
  const sanitized = sanitizeOwnerName(trimmed);
  if (sanitized.name) return true;
  if (/\b(LLC|INC|TRUST|ESTATE|HEIRS|BANK)\b/i.test(trimmed) && hasPersonOrEntitySignal(trimmed)) {
    return true;
  }
  return false;
}

function extractOwnerFromHeaderRest(rest: string): string | null {
  const inline = rest.match(/^(.+?)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$/);
  if (inline) return inline[1]!.trim() || null;
  const moneyIdx = rest.search(/\s[\d,]{3,}\s+[\d,]/);
  if (moneyIdx > 0) return rest.slice(0, moneyIdx).trim() || null;
  const singleTrailing = rest.match(/^(.+?)[\t ]+([\d,]{3,})\s*$/);
  if (singleTrailing) return singleTrailing[1]!.trim() || null;
  return rest.trim() || null;
}

function parseHeaderLine(accountNumber: string, rest: string): Omit<AccountBlock, "bodyLines"> {
  const inline = rest.match(/^(.+?)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$/);
  const ownerRaw = extractOwnerFromHeaderRest(rest);
  return {
    accountNumber,
    headerLine: `${accountNumber}  ${rest}`,
    headerRest: rest,
    ownerRaw,
    headerLand: inline ? cleanMoney(inline[2]) : null,
    headerBuilding: inline ? cleanMoney(inline[3]) : null,
    headerExempt: inline ? cleanMoney(inline[4]) : null,
    headerAssessment: inline ? cleanMoney(inline[5]) : null,
    mailLines: [],
  };
}

function isTabValueRow(line: string): boolean {
  return /^[\d,]+\s+[\d,]+\s+[\d,]+\s+[\d,]+\s*$/.test(line.trim());
}

function isMailOrAddressLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (MAP_LOT_LINE_RE.test(trimmed)) return false;
  if (DEED_REF_RE.test(trimmed)) return false;
  if (/^acres\b/i.test(trimmed)) return false;
  if (/^(soft|mixed|hard):/i.test(trimmed)) return false;
  if (isSubtotalLine(trimmed)) return false;
  if (/^\d{2,4}[\t ]+[A-Z]/.test(trimmed)) return false;
  if (isTabValueRow(trimmed)) return false;
  if (/^0[\t ]+[\d,]+\s*$/.test(trimmed)) return false;
  return true;
}

function segmentAccountBlocks(text: string): AccountBlock[] {
  const lines = text.split("\n");
  const blocks: AccountBlock[] = [];
  let current: AccountBlock | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headerMatch =
      trimmed.match(/^(\d{2,4})[\t ]+(.+)$/) ??
      trimmed.match(/^[\d,]+[\t ]+(\d{2,4})[\t ]+(.+)$/);
    if (headerMatch && isValidAccountHeader(headerMatch[1]!, headerMatch[2]!)) {
      if (current) blocks.push(current);
      current = {
        ...parseHeaderLine(headerMatch[1]!, headerMatch[2]!),
        bodyLines: [],
      };
      continue;
    }

    if (!current) continue;

    if (MAP_LOT_LINE_RE.test(trimmed)) {
      current.bodyLines.push(trimmed);
      continue;
    }

    const hasMapLotInBlock = current.bodyLines.some((l) => MAP_LOT_LINE_RE.test(l));
    if (!hasMapLotInBlock && isMailOrAddressLine(trimmed)) {
      current.mailLines.push(trimmed);
    } else {
      current.bodyLines.push(trimmed);
    }
  }

  if (current) blocks.push(current);
  return blocks;
}

function findMapLotsInBlock(block: AccountBlock): Array<{ raw: string; normalized: string; index: number }> {
  const lots: Array<{ raw: string; normalized: string; index: number }> = [];
  for (let i = 0; i < block.bodyLines.length; i++) {
    const line = block.bodyLines[i]!;
    const match = line.match(MAP_LOT_LINE_RE);
    if (!match?.[1]) continue;
    const normalized = normalizeMapBkLot(match[1]);
    if (!normalized) continue;
    lots.push({ raw: match[1], normalized, index: i });
  }
  return lots;
}

function extractTabValueRow(lines: string[]): LotValues | null {
  for (const line of lines) {
    const trimmed = line.trim();
    const tabMatch = trimmed.match(/^([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$/);
    if (!tabMatch) continue;
    const land = cleanMoney(tabMatch[1]);
    const building = cleanMoney(tabMatch[2]);
    const exempt = cleanMoney(tabMatch[3]);
    const assessment = cleanMoney(tabMatch[4]);
    if (isValidMoney(land) || isValidMoney(building) || isValidMoney(assessment)) {
      return { land, building, exempt, assessment, source: "tab_row" };
    }
  }
  return null;
}

function extractColumnarValues(lines: string[]): LotValues | null {
  for (const line of lines) {
    const trimmed = line.trim();
    const assessmentOnly = trimmed.match(/^0[\t ]+([\d,]+)\s*$/);
    if (assessmentOnly) {
      const assessment = cleanMoney(assessmentOnly[1]);
      if (isValidMoney(assessment)) {
        return {
          land: null,
          building: null,
          exempt: "0",
          assessment,
          source: "assessment_only",
        };
      }
    }
  }

  const moneyLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || isSubtotalLine(trimmed)) continue;
    if (/^(soft|mixed|hard|acres):/i.test(trimmed)) continue;
    if (DEED_REF_RE.test(trimmed)) continue;

    const tokens = trimmed.split(/[\t ]+/).filter(Boolean);
    for (const token of tokens) {
      const money = parseMoneyToken(token);
      if (money && isValidMoney(money)) moneyLines.push(money);
    }

    if (/^[\d,]+$/.test(trimmed)) {
      const money = cleanMoney(trimmed);
      if (money && isValidMoney(money)) moneyLines.push(money);
    }
  }

  if (moneyLines.length === 0) return null;

  const uniqueLarge = [...new Set(moneyLines.filter((m) => Number(m) >= 1000))];
  if (uniqueLarge.length >= 2) {
    const land = uniqueLarge[0] ?? null;
    const building = uniqueLarge[1] ?? null;
    const assessment =
      uniqueLarge[2] ??
      (land && building ? String(Number(land) + Number(building)) : uniqueLarge[0] ?? null);
    return { land, building, exempt: "0", assessment, source: "columnar" };
  }

  if (uniqueLarge.length === 1) {
    return {
      land: uniqueLarge[0],
      building: "0",
      exempt: "0",
      assessment: uniqueLarge[0],
      source: "columnar_single",
    };
  }

  return null;
}

function extractLotValues(
  block: AccountBlock,
  lotIndex: number,
  lotCount: number,
  headerExtractedLand: string | null,
): LotValues | null {
  const start = lotIndex;
  const nextLotIdx = block.bodyLines.findIndex((line, idx) => idx > start && MAP_LOT_LINE_RE.test(line));
  const span = block.bodyLines.slice(start + 1, nextLotIdx >= 0 ? nextLotIdx : undefined);

  if (lotCount === 1 && block.headerAssessment && isValidMoney(block.headerAssessment)) {
    return {
      land: block.headerLand,
      building: block.headerBuilding,
      exempt: block.headerExempt,
      assessment: block.headerAssessment,
      source: "header_inline",
    };
  }

  const tab = extractTabValueRow(span);
  if (tab) return tab;

  const preLotSpan = block.bodyLines.slice(0, start);
  const preTab = extractTabValueRow(preLotSpan);
  if (preTab) return preTab;

  const columnar = extractColumnarValues(span);
  if (columnar) return columnar;

  if (headerExtractedLand && isValidMoney(headerExtractedLand)) {
    return {
      land: headerExtractedLand,
      building: "0",
      exempt: "0",
      assessment: headerExtractedLand,
      source: "header_land_tail",
    };
  }

  return null;
}

function isOwnerCandidateLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/,/.test(trimmed)) return true;
  if (/\b(LLC|INC|TRUST|ESTATE|HEIRS|LTD|BANK)\b/i.test(trimmed)) return true;
  return false;
}

function resolveBlockOwner(block: AccountBlock): {
  ownerName: string | null;
  extractedLand: string | null;
} {
  const fromHeader = sanitizeOwnerName(block.headerRest);
  if (fromHeader.name) return { ownerName: fromHeader.name, extractedLand: fromHeader.extractedLand };

  for (const line of block.mailLines) {
    if (!isOwnerCandidateLine(line)) continue;
    const sanitized = sanitizeOwnerName(line);
    if (sanitized.name) {
      return { ownerName: sanitized.name, extractedLand: sanitized.extractedLand };
    }
  }

  return { ownerName: null, extractedLand: null };
}

function scoreRow(
  ownerName: string | null,
  assessment: string | null,
  mapLot: string,
): number {
  if (!mapLot) return 0.1;
  if (!ownerName && !assessment) return 0.2;
  if (!ownerName || !isValidMoney(assessment)) return 0.3;
  return 0.9;
}

/**
 * Parse MRS-style town Real Estate Tax Commitment Book text (forward account-block parser).
 */
export function parseCommitmentText(
  text: string,
  geocode: string,
  taxYear: number | null,
): ParsedCommitmentRow[] {
  const cleaned = preprocessCommitmentText(text);
  const blocks = segmentAccountBlocks(cleaned);
  const rowByKey = new Map<string, ParsedCommitmentRow>();

  for (const block of blocks) {
    const resolvedOwner = resolveBlockOwner(block);
    const ownerName = resolvedOwner.ownerName;
    const mailAddress = block.mailLines.length > 0 ? block.mailLines.join(", ") : null;
    const lots = findMapLotsInBlock(block);
    if (lots.length === 0) continue;

    for (const lot of lots) {
      const mapJoinKey = organizedMapJoinKey(geocode, lot.normalized);
      if (!mapJoinKey) continue;

      const values = extractLotValues(
        block,
        lot.index,
        lots.length,
        resolvedOwner.extractedLand,
      );
      const assessedLandValue = values?.land ?? null;
      const assessedBuildingValue = values?.building ?? null;
      const assessedTotalValue = values?.assessment ?? null;
      const parseConfidence = scoreRow(ownerName, assessedTotalValue, lot.normalized);

      const row: ParsedCommitmentRow = {
        accountNumber: block.accountNumber,
        mapJoinKey,
        mapLot: lot.normalized,
        ownerName,
        mailAddress,
        assessedLandValue,
        assessedBuildingValue,
        assessedTotalValue,
        taxYear,
        parseConfidence,
        attrsRaw: {
          mapLotRaw: lot.raw,
          accountLine: block.headerLine,
          valueSource: values?.source ?? null,
          mailLines: block.mailLines,
        },
      };

      const existing = rowByKey.get(mapJoinKey);
      if (!existing || row.parseConfidence > existing.parseConfidence) {
        rowByKey.set(mapJoinKey, row);
      }
    }
  }

  return [...rowByKey.values()];
}
