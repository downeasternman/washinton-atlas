import type { JoinMethod } from "./crosswalk";
import { normalizeMapBkLot, organizedMapJoinKey } from "./map-lot-normalize";
import type { ParsedCommitmentRow } from "./commitment-parser";

export interface OrganizedGeometryStub {
  id: string;
  municipalityId: string;
  municipalityName: string;
  geocode: string;
  mapBkLot: string | null;
  mapJoinKey: string | null;
  stateId: string | null;
  propLoc: string | null;
}

export interface JoinedOrganizedParcel {
  id: string;
  sourceParcelId: string;
  municipalityId: string;
  municipalityName: string;
  accountNumber: string | null;
  mapLot: string | null;
  mapJoinKey: string | null;
  ownerName: string | null;
  mailAddress: string | null;
  assessedLandValue: string | null;
  assessedBuildingValue: string | null;
  assessedTotalValue: string | null;
  taxYear: number | null;
  joinConfidence: number | null;
  joinMethod: JoinMethod;
  taxRecordId: string | null;
  attrsRaw: Record<string, unknown> | null;
}

export function buildOrganizedTaxLookups(
  records: Array<ParsedCommitmentRow & { id: string }>,
) {
  const byMapJoinKey = new Map<string, (typeof records)[number]>();
  for (const record of records) {
    byMapJoinKey.set(record.mapJoinKey.toUpperCase(), record);
  }
  return { byMapJoinKey };
}

export function joinOrganizedTaxToGeometry(
  geometry: OrganizedGeometryStub[],
  lookups: ReturnType<typeof buildOrganizedTaxLookups>,
): JoinedOrganizedParcel[] {
  return geometry.map((geom) => {
    const key = geom.mapJoinKey?.toUpperCase() ?? "";
    const tax = key ? lookups.byMapJoinKey.get(key) : undefined;
    const joinMethod: JoinMethod = tax ? "map_lot" : "unjoined";

    return {
      id: geom.id,
      sourceParcelId: geom.stateId ?? geom.mapBkLot ?? geom.id,
      municipalityId: geom.municipalityId,
      municipalityName: geom.municipalityName,
      accountNumber: tax?.accountNumber ?? null,
      mapLot: geom.mapBkLot ? normalizeMapBkLot(geom.mapBkLot) : null,
      mapJoinKey: geom.mapJoinKey,
      ownerName: tax?.ownerName ?? null,
      mailAddress: tax?.mailAddress ?? null,
      assessedLandValue: tax?.assessedLandValue ?? null,
      assessedBuildingValue: tax?.assessedBuildingValue ?? null,
      assessedTotalValue: tax?.assessedTotalValue ?? null,
      taxYear: tax?.taxYear ?? null,
      joinConfidence: tax ? tax.parseConfidence : null,
      joinMethod,
      taxRecordId: tax?.id ?? null,
      attrsRaw: tax?.attrsRaw ?? null,
    };
  });
}

export function organizedParcelId(
  municipalityId: string,
  stateId: string | null,
  mapBkLot: string | null,
): string {
  if (stateId) {
    const slug = stateId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `org-${municipalityId}-${slug}`;
  }
  const lot = normalizeMapBkLot(mapBkLot) ?? "unknown";
  const lotSlug = lot.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `org-${municipalityId}-${lotSlug}`;
}

export function geometryOrganizedMapJoinKey(
  geocode: string,
  mapBkLot: string | null,
): string | null {
  const normalized = normalizeMapBkLot(mapBkLot);
  if (!normalized) return null;
  return organizedMapJoinKey(geocode, normalized);
}
