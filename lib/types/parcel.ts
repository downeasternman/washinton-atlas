import type { Source } from "./source";

export interface Parcel {
  id: string;
  sourceParcelId: string | null;
  municipalityId: string | null;
  ownerName: string | null;
  ownerNameNormalized: string | null;
  situsAddress: string | null;
  mailAddress: string | null;
  assessedLandValue: string | null;
  assessedBuildingValue: string | null;
  assessedTotalValue: string | null;
  taxYear: number | null;
  acreage: string | null;
  landUse: string | null;
  sourceId: string | null;
  attrsRaw: Record<string, unknown> | null;
  updatedAt: string | null;
}

export interface ParcelWithSource extends Parcel {
  source: Source | null;
  geometrySource: Source | null;
}
