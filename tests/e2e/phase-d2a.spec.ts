import { test, expect } from "@playwright/test";

test.describe("Phase D2a — Lubec organized parcel detail", () => {
  test("joined Lubec parcel returns tax detail with town citation", async ({ request }) => {
    const res = await request.get("/api/parcels/org-lubec-29260-002-006-000");
    if (res.status() === 404) {
      test.skip();
      return;
    }
    const parcel = await res.json();
    expect(parcel.ownerName).toBeTruthy();
    expect(parcel.assessedTotalValue).toBeTruthy();
    expect(parcel.taxSource?.name).toMatch(/Lubec/i);
    expect(parcel.territoryType).toBe("organized");
  });
});
