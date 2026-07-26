# Changelog

All notable changes to Washington County Atlas are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.3] - 2026-07-26

### Added

- Phase C: municipality filter with map fly-to, place-name search, and explorer chrome
- Phase D1: UT parcel geometry ingest, MRS valuation book PDF parser, map/lot index crosswalk, and tax-to-geometry join
- Phase D2-SCAFFOLD: organized-town manifest (40 towns), Maine GeoLibrary parcel geometry download, commitment parser, merge pipeline
- Phase D2a: Lubec pilot — 1,894 organized parcels, 1,054 with tax from 2024 commitment book
- Parcel vector tiles (`public/tiles/parcels.pmtiles`) and click-to-inspect detail panel
- APIs: `/api/municipalities`, `/api/places`, `/api/parcels/[id]`
- ETL scripts: `etl:ut:*`, `etl:org:*`, `etl:merge:parcels`, `phase:c`, `phase:d1`, `phase:d2-scaffold`, `phase:d2a`
- Unit tests for search, UT tax parsing/join, and organized-town normalization
- E2E tests for Phase C, D1, and D2a gates
- README screenshots under `docs/screenshots/`

### Changed

- Map glyphs switched to Protomaps CDN (fixes MapLibre 404s on label rendering)
- `join-tax-to-geometry` writes `ut-parcels-joined.json`; `merge-parcel-datasets` produces unified `parcels.json`
- Parcel detail panel shows account number, organized join notes, and WAP geometry caveat for UT only
- Coverage manifest updated with per-municipality parcel counts and tax join rates

### Fixed

- AtlasMap hydration mismatch (client-only map mount via `useSyncExternalStore`)
- Lubec map/lot join: strip GeoLibrary `-000` lot padding for commitment book keys
- Baring UT mail-address fallback for parcels on Day Block geometry

### Notes

- 7,290 total parcels on map; UT tax join rate ~58.8% (3,172 / 5,396)
- Lubec uses 2024 commitment PDF because 2025 book is not text-extractable
- Organized-town rollout continues in D2b–f sub-gates

## [0.0.2] - 2026-07-26

### Added

- Phase B basemap: Maine GeoLibrary municipal/county boundaries + OSM roads/water/places
- PMTiles archives in `public/tiles/` (`basemap.pmtiles`, `boundaries.pmtiles`)
- Coastal MapLibre style with land, water, roads, municipal outlines, and labels
- Map attribution chrome with source as-of dates
- ETL scripts: `etl:boundaries`, `etl:osm`, `tiles:*`, `phase:b`
- `/api/meta/map-sources` endpoint for map source metadata
- Windows-friendly Node geojson-vt → MBTiles → PMTiles tile pipeline

### Changed

- Washington County bbox refined from Maine GeoLibrary county boundary download
- Map loads PMTiles via absolute `pmtiles://` URLs after client origin is known

### Fixed

- PMTiles fetch 404s from relative `pmtiles:///tiles/...` URLs

## [0.0.1] - 2026-07-26

### Added

- First stable scaffold (Phase A gate candidate)
- Next.js App Router application with TypeScript and Tailwind CSS
- Coastal atlas visual tokens and provisional brand header: Washington County Atlas
- MapLibre map shell framed to Washington County, Maine
- Drizzle schema stubs for sources, municipalities, places, parcels, coverage, and tax ingest tables
- Tax field-map and confidence helper stubs for later PDF pipelines
- Data manifest skeletons for sources, tax sources, and coverage
- Unit test for county bounding-box helpers
- Playwright smoke test stub for homepage brand and map canvas
- Project README documenting gated phases, data policy, and local setup

### Fixed

- Map camera framing uses `initialViewState.bounds` instead of `fitBounds` on load
- Pin `maplibre-gl` to v5 for compatibility with react-map-gl camera sync

### Notes

- No parcel tiles, ownership, tax data, or municipality filter yet (Phases B–D)
- Branding remains provisional
