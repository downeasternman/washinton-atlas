/**
 * Download Washington County municipal + county boundaries from Maine GeoLibrary.
 * Writes processed GeoJSON and updates source/coverage manifests.
 */
import path from "node:path";
import {
  COUNTY_URL,
  METWP_URL,
  PROCESSED_DIR,
  RAW_DIR,
  MANIFEST_DIR,
  bboxFromFeatureCollection,
  ensureDirs,
  fetchGeoJson,
  slugify,
  todayIsoDate,
  writeJson,
  readJson,
} from "./paths";

async function fetchAllMetwpWashington(): Promise<GeoJSON.FeatureCollection> {
  const features: GeoJSON.Feature[] = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const params = new URLSearchParams({
      where: "COUNTY='Washington'",
      outFields: "TOWN,COUNTY,GEOCODE",
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
      resultOffset: String(offset),
      resultRecordCount: String(pageSize),
    });
    const page = await fetchGeoJson(`${METWP_URL}?${params.toString()}`);
    features.push(...page.features);
    if (page.features.length < pageSize) break;
    offset += pageSize;
  }

  return { type: "FeatureCollection", features };
}

async function fetchCounty(): Promise<GeoJSON.FeatureCollection> {
  const params = new URLSearchParams({
    where: "COUNTY='Washington'",
    outFields: "COUNTY,CNTYCODE",
    returnGeometry: "true",
    outSR: "4326",
    f: "geojson",
  });
  return fetchGeoJson(`${COUNTY_URL}?${params.toString()}`);
}

async function main() {
  await ensureDirs(RAW_DIR, PROCESSED_DIR, MANIFEST_DIR);

  console.log("Downloading Washington County municipalities (METWP)...");
  const municipalities = await fetchAllMetwpWashington();
  console.log(`  ${municipalities.features.length} municipal polygons`);

  console.log("Downloading Washington County boundary...");
  const county = await fetchCounty();
  console.log(`  ${county.features.length} county feature(s)`);

  // Normalize municipality properties for atlas use
  const normalized: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: municipalities.features.map((f) => {
      const town = String(f.properties?.TOWN ?? "Unknown");
      const geocode = f.properties?.GEOCODE;
      return {
        type: "Feature",
        properties: {
          id: slugify(town),
          name: town,
          county: String(f.properties?.COUNTY ?? "Washington"),
          geocode: geocode != null ? String(geocode) : null,
          is_organized: true,
        },
        geometry: f.geometry,
      };
    }),
  };

  const countyNormalized: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: county.features.map((f) => ({
      type: "Feature",
      properties: {
        id: "washington-county",
        name: "Washington County",
        county: String(f.properties?.COUNTY ?? "Washington"),
        cntycode: f.properties?.CNTYCODE != null ? String(f.properties.CNTYCODE) : null,
      },
      geometry: f.geometry,
    })),
  };

  const bbox = bboxFromFeatureCollection(countyNormalized.features.length
    ? countyNormalized
    : normalized);

  await writeJson(path.join(RAW_DIR, "metwp-washington.geojson"), municipalities);
  await writeJson(path.join(RAW_DIR, "county-washington.geojson"), county);
  await writeJson(path.join(PROCESSED_DIR, "municipalities.geojson"), normalized);
  await writeJson(path.join(PROCESSED_DIR, "county.geojson"), countyNormalized);
  await writeJson(path.join(PROCESSED_DIR, "county-bbox.json"), {
    bbox,
    asOfDate: todayIsoDate(),
    sourceId: "me-geolibrary-boundaries",
  });

  // Municipality metadata list for Phase C filter (no PostGIS required for Gate B)
  const municipalityList = normalized.features.map((f) => ({
    id: f.properties?.id,
    name: f.properties?.name,
    geocode: f.properties?.geocode,
    isOrganized: true,
  }));
  await writeJson(path.join(PROCESSED_DIR, "municipalities.json"), municipalityList);

  // Update sources manifest as-of
  const sourcesPath = path.join(MANIFEST_DIR, "sources.json");
  const sources = await readJson<{
    version: number;
    description: string;
    sources: Array<Record<string, unknown>>;
  }>(sourcesPath);

  for (const s of sources.sources) {
    if (s.id === "me-geolibrary-boundaries") {
      s.asOfDate = todayIsoDate();
      s.url =
        "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/METWP_dissolved/FeatureServer";
      s.countyUrl =
        "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/Maine_County_Boundary_Polygons/FeatureServer";
      s.featureCount = normalized.features.length;
    }
  }
  await writeJson(sourcesPath, sources);

  // Seed coverage entries (geometry only for now)
  const coveragePath = path.join(MANIFEST_DIR, "coverage.json");
  const coverage: {
    version: number;
    description: string;
    updatedAt: string;
    municipalities: Record<string, Record<string, unknown>>;
  } = {
    version: 1,
    description:
      "Per-municipality coverage status for parcel geometry, ownership, and tax data",
    updatedAt: new Date().toISOString(),
    municipalities: {},
  };
  for (const m of municipalityList) {
    const id = String(m.id);
    coverage.municipalities[id] = {
      name: m.name,
      hasParcelGeometry: false,
      hasOwnership: false,
      hasTaxAssessment: false,
      parcelCount: 0,
      notes: "Boundary geometry available; ownership/tax pending Phase D",
    };
  }
  await writeJson(coveragePath, coverage);

  console.log("Done.");
  console.log(`  bbox: [${bbox.map((n) => n.toFixed(4)).join(", ")}]`);
  console.log(`  wrote ${path.join(PROCESSED_DIR, "municipalities.geojson")}`);
  console.log(`  wrote ${path.join(PROCESSED_DIR, "county.geojson")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
