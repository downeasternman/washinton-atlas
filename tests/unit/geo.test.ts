import { describe, it, expect } from "vitest";
import { bboxToFitBounds } from "@/lib/geo/bbox";
import { WASHINGTON_COUNTY_BBOX } from "@/lib/geo/county";

describe("bboxToFitBounds", () => {
  it("converts a bbox to MapLibre fitBounds format", () => {
    const result = bboxToFitBounds(WASHINGTON_COUNTY_BBOX);
    expect(result).toEqual([
      [WASHINGTON_COUNTY_BBOX[0], WASHINGTON_COUNTY_BBOX[1]],
      [WASHINGTON_COUNTY_BBOX[2], WASHINGTON_COUNTY_BBOX[3]],
    ]);
  });
});

describe("WASHINGTON_COUNTY_BBOX", () => {
  it("has four numeric coordinates", () => {
    expect(WASHINGTON_COUNTY_BBOX).toHaveLength(4);
    expect(WASHINGTON_COUNTY_BBOX.every((n) => typeof n === "number")).toBe(true);
  });
});
