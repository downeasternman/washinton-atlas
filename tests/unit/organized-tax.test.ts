import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseCommitmentText } from "@/lib/tax/commitment-parser";
import {
  buildOrganizedTaxLookups,
  joinOrganizedTaxToGeometry,
  organizedParcelId,
} from "@/lib/tax/organized-join";
import { normalizeMapBkLot, organizedMapJoinKey } from "@/lib/tax/map-lot-normalize";

const lubecSnippet = readFileSync(
  path.join(process.cwd(), "tests", "fixtures", "lubec-commitment-snippet.txt"),
  "utf8",
);

describe("normalizeMapBkLot", () => {
  it("preserves padded map-lot segments", () => {
    expect(normalizeMapBkLot("004-067")).toBe("004-067");
    expect(normalizeMapBkLot("016-046")).toBe("016-046");
    expect(normalizeMapBkLot("002-006-000")).toBe("002-006");
  });
});

describe("parseCommitmentText", () => {
  it("extracts owner and assessment from MRS commitment snippet", () => {
    const rows = parseCommitmentText(lubecSnippet, "29260", 2025);
    const akerley = rows.find((r) => r.mapLot === "004-067");
    expect(akerley?.ownerName?.toUpperCase()).toContain("AKERLEY");
    expect(akerley?.assessedTotalValue).toBe("94500");
    expect(akerley?.accountNumber).toBe("213");
  });
});

describe("joinOrganizedTaxToGeometry", () => {
  it("joins tax to geometry by geocode map-lot key", () => {
    const mapJoinKey = organizedMapJoinKey("29260", "004-067");
    const taxRows = parseCommitmentText(lubecSnippet, "29260", 2025).map((r, i) => ({
      ...r,
      id: `tax-${i}`,
    }));
    const lookups = buildOrganizedTaxLookups(taxRows);
    const parcelId = organizedParcelId("lubec", "ME29260001", "004-067");
    const joined = joinOrganizedTaxToGeometry(
      [
        {
          id: parcelId,
          municipalityId: "lubec",
          municipalityName: "Lubec",
          geocode: "29260",
          mapBkLot: "004-067",
          mapJoinKey,
          stateId: "ME29260001",
          propLoc: "58 Englishman Bay Road",
        },
      ],
      lookups,
    );

    expect(joined[0]?.ownerName?.toUpperCase()).toContain("AKERLEY");
    expect(joined[0]?.joinMethod).toBe("map_lot");
  });
});
