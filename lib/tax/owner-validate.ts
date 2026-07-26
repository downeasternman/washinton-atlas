const EXEMPTION_LABEL_RE = /homestead|veteran|vet-nme|exempt|post ww/i;
const STREET_WORD_RE =
  /\b(ROAD|RD|ST|STREET|LN|LANE|DRIVE|DR|AVE|COVE|HIGHWAY|HWY|WAY|AVENUE|CIRCLE|COURT|CT|PLACE|TRAIL|BOULEVARD|ROUTE|POINT|APT|APARTMENT)\b/i;
const ENTITY_RE = /\b(LLC|INC|TRUST|ESTATE|L\.L\.C\.|HEIRS|LTD|BANK|PLT)\b/i;

export function isValidMoney(value: string | null | undefined): boolean {
  if (!value) return false;
  const cleaned = value.replace(/,/g, "").trim();
  if (!/^\d+$/.test(cleaned)) return false;
  const num = Number(cleaned);
  return num >= 100 && num <= 50_000_000;
}

export function hasPersonOrEntitySignal(name: string): boolean {
  if (/,/.test(name)) return true;
  if (ENTITY_RE.test(name)) return true;
  if (STREET_WORD_RE.test(name)) return false;

  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) {
    return tokens.every((token) => /^[A-Z][A-Za-z.'-]+$/.test(token));
  }

  return false;
}

export function isValidOwnerName(name: string | null | undefined): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 4) return false;
  if (/^[\d,\.\s]+$/.test(trimmed)) return false;
  if (/[\t][\d,]/.test(trimmed)) return false;
  if (/\s[\d,]{3,}$/.test(trimmed)) return false;
  if (EXEMPTION_LABEL_RE.test(trimmed)) return false;
  if (/\b(soft|mixed|hard|acres)\b/i.test(trimmed)) return false;
  if (STREET_WORD_RE.test(trimmed) && !hasPersonOrEntitySignal(trimmed)) return false;
  if (!hasPersonOrEntitySignal(trimmed)) return false;
  return /[A-Za-z]/.test(trimmed);
}

export function isValidAccountNumber(account: string | null | undefined): boolean {
  if (!account) return false;
  const trimmed = account.trim();
  if (!/^\d{2,4}$/.test(trimmed)) return false;
  if (trimmed === "0") return false;
  return true;
}

export function hasValidOwner(record: { ownerName: string | null }): boolean {
  return isValidOwnerName(record.ownerName);
}

export function hasValidAssessment(record: {
  assessedTotalValue: string | null;
}): boolean {
  return isValidMoney(record.assessedTotalValue);
}

export function isQualityTaxRecord(
  record: Pick<{ ownerName: string | null; assessedTotalValue: string | null }, "ownerName" | "assessedTotalValue">,
): boolean {
  return hasValidOwner(record) && hasValidAssessment(record);
}
