/**
 * Report organized-town parse and join coverage.
 */
import path from "node:path";
import { getOrganizedTown, loadOrganizedTownsManifest } from "@/lib/tax/organized-municipalities";
import { readJson } from "../paths";
import { parseTownArg } from "./cli";
import {
  ORGANIZED_PARCELS_GEOJSON,
  ORGANIZED_PARCELS_JOINED_JSON,
  organizedTaxRecordsJson,
} from "./paths";

async function reportTown(townId: string) {
  const town = await getOrganizedTown(townId);
  if (!town) {
    throw new Error(`Unknown organized town: ${townId}`);
  }

  const geojson = await readJson<GeoJSON.FeatureCollection>(ORGANIZED_PARCELS_GEOJSON);
  const geomCount = geojson.features.filter(
    (f) => String(f.properties?.municipalityId ?? "") === townId,
  ).length;

  let taxCount = 0;
  try {
    const taxRecords = await readJson<unknown[]>(organizedTaxRecordsJson(townId));
    taxCount = taxRecords.length;
  } catch {
    taxCount = 0;
  }

  let joined = 0;
  let total = 0;
  try {
    const parcels = await readJson<
      Array<{ municipalityId: string; assessedTotalValue: string | null }>
    >(ORGANIZED_PARCELS_JOINED_JSON);
    const townParcels = parcels.filter((p) => p.municipalityId === townId);
    total = townParcels.length;
    joined = townParcels.filter((p) => p.assessedTotalValue != null).length;
  } catch {
    joined = 0;
    total = 0;
  }

  const rate = geomCount > 0 ? (joined / geomCount) * 100 : 0;
  console.log(`\n=== ${town.name} (${townId}) ===`);
  console.log(`  Geometry parcels:     ${geomCount}`);
  console.log(`  Tax records (parsed):   ${taxCount}`);
  console.log(`  Parcels with tax:     ${joined}`);
  console.log(`  Join rate (tax/geom): ${rate.toFixed(1)}%`);
}

async function main() {
  const townId = parseTownArg();
  if (townId) {
    await reportTown(townId);
    return;
  }

  const manifest = await loadOrganizedTownsManifest();
  console.log("\n=== Washington County Organized — Coverage Report ===");
  for (const town of manifest.towns) {
    await reportTown(town.id);
  }
  console.log(`\nExcluded: ${manifest.excluded.map((e) => e.id).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
