# Changelog

All notable changes to Washington County Atlas are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.9] - 2026-07-27

### Added

- Phase E1 parcel coverage symbology: full / owner-only / boundary-only tiers plus tax exemption (coral) and Tree Growth program colors
- Map legend (`ParcelCoverageLegend`) and muted shades for low-confidence joins
- UT and organized parsers persist `assessedExemptionValue`, `hasTreeGrowth`, and forest enrollment acreage
- Machiasport map-lot commitment layout: mail-line owner resolution, situs labels, institutional `&` entity names
- Fixtures and unit tests for exemption, tree growth, parcel coverage, and Machiasport blocks

### Changed

- Machiasport owner joins: 1128/1226 (92.0%); quality joins recounted honestly at 449/1226 (36.6%)
- Parcel detail panel shows tax exemption, Tree Growth enrollment, and tax-book situs labels
- PMTiles emit `coverageTier`, `program`, and `joinLow` instead of binary `hasTax`/`hasOwner`

### Notes

- Exemption and Tree Growth map colors require re-parsing organized towns to populate new fields county-wide; tier colors work from existing data
- Machiasport quality rate reflects sparse assessment values in the map-lot PDF, not owner parse regression

## [0.0.8] - 2026-07-26

### Added

- Phase D2f: Whitneyville commitment join; remaining D2f towns marked failed (clerk/office-only)
- Roque Bluffs remediation: 2025 commitment join + 2024 fallback download; tax map index + sheets 1–11 catalog
- `phase:d2f` and `phase:d2e-roque-bluffs` ETL scripts
- Commitment owner cleanup for trailing `0 0` columns and address-fragment false owners

### Changed

- Organized towns with ownership joins: 24
- Total atlas parcels: 31,567 (5,396 UT + 26,171 organized)
- Roque Bluffs: 514 / 623 owner joins; 491 quality joins
- Whitneyville: 247 / 256 owner joins; 223 quality joins (after cleanup)

### Notes

- D2f failed (no public commitment PDF): Crawford, Deblois, Dennysville, Meddybemps, Topsfield, Vanceboro, Waite
- Roque Bluffs tax maps are image-only; cataloged, not used for ownership
- Still failed from earlier waves: Beals, Beddington, Columbia, Danforth, East Machias, Harrington, Jonesboro, Northfield, Princeton
- Phase E remains next gate

## [0.0.7] - 2026-07-26

### Added

- Phase D2e: Alexander, Cherryfield, Columbia Falls, Machiasport, Marshfield, Wesley, and Whiting organized-town tax joins
- Cherryfield R/U map-lot normalization and land-first commitment header parsing
- Wesley letter-grid map-lot join candidates (e.g. `G-0210` → bare GeoLibrary keys)
- `phase:d2e` ETL script; tax source entries for D2e joined towns
- `docs/STATE-OF-PROJECT.md` review snapshot

### Changed

- Organized towns with ownership joins: 22
- Total atlas parcels: 30,688 (5,396 UT + 25,292 organized)
- Alexander: 509 / 840 owner joins; 446 quality joins
- Cherryfield: 1,015 / 1,018 owner joins; 949 quality joins
- Columbia Falls: 460 / 515 owner joins; 408 quality joins
- Machiasport: 1,131 / 1,226 owner joins; 1,002 quality joins
- Marshfield: 419 / 425 owner joins; 395 quality joins
- Wesley: 593 / 828 owner joins; 574 quality joins
- Whiting: 903 / 904 owner joins; 745 quality joins

### Notes

- D2e failed (no usable public text commitment PDF): Beddington, Columbia, Danforth, East Machias, Harrington, Jonesboro, Northfield, Princeton, Roque Bluffs
- Beals remains failed from D2d
- Cherryfield uses 2020 commitment book (newest public PDF); Marshfield uses 2024 text book (2025 image-only)
- Wesley 2025 text commitment book; prior Drive 2024 PDF was image-only
- D2f organized-town rollout continues

## [0.0.6] - 2026-07-26

### Added

- Phase D2d: Addison, Charlotte, Cooper, Cutler, Milbridge, Pembroke, and Perry organized-town tax joins from municipal commitment PDFs
- Robbinston owner-only join from town map/lot index plus RETTD transfer PDF overrides (`phase:d2d-robbinston`)
- Cutler map-lot-first commitment header support and padded join-key indexing
- Robbinston map-lot normalizer, index/transfers parsers, and ownership merge with date-ranked overrides
- `phase:d2d` and `phase:d2d-robbinston` ETL scripts; tax source entries for D2d towns including Robbinston

### Changed

- Organized parcel count on map: 19,536 across fifteen towns
- Total atlas parcels: 24,932 (5,396 UT + 19,536 organized)
- Addison: 1,306 / 1,419 owner joins; 1,072 quality joins
- Charlotte: 412 / 466 owner joins; 360 quality joins
- Cooper: 289 / 370 owner joins; 244 quality joins
- Cutler: 542 / 624 owner joins; 448 quality joins
- Milbridge: 731 / 1,692 owner joins; 600 quality joins
- Pembroke: 879 / 1,006 owner joins; 785 quality joins
- Perry: 852 / 1,006 owner joins; 703 quality joins
- Robbinston: 582 / 607 owner joins; assessments not published

### Notes

- Beals remains failed (no public owner list or commitment PDF)
- Robbinston uses owner index + 2024/08 and 24-25 transfer PDFs; no invented assessments
- Milbridge map-lot join rate remains lower (possible `R##` vs GeoLibrary key mismatch)
- D2e–f organized-town rollout continues

## [0.0.5] - 2026-07-26

### Added

- Phase D2b: Baileyville, Jonesport, and Steuben organized-town tax joins from municipal commitment PDFs
- `phase:d2b` ETL script; tax source entries for Baileyville, Jonesport, and Steuben

### Changed

- Organized parcel count on map: 12,346 across seven towns
- Total atlas parcels: 17,742 (5,396 UT + 12,346 organized)
- Baileyville: 1,236 / 1,361 owner joins; 1,040 quality joins (2024-25 RE commitment book)
- Jonesport: 1,227 / 1,579 owner joins; 1,028 quality joins (2025 RE commitment book)
- Steuben: 1,321 / 1,605 owner joins; 1,145 quality joins (2025 RE commitment book)

### Notes

- Steuben commitment PDF resolved via Town Web storage URL scrape
- D2d–f organized-town rollout continues

## [0.0.4] - 2026-07-26

### Added

- Phase D2a-REMEDIATION-2: commitment parser v3 (`mrs-commitment-book-v3`) with owner sanitization, street-name rejection, owner-only joins, and parent-lot fallback
- Phase D2c: Calais, Eastport, and Machias organized-town tax joins from municipal commitment PDFs
- Eastport grid map-lot ID support (e.g. `I7-0B4-20`) in commitment parser
- Owner validation/normalization libs (`owner-validate.ts`, `owner-normalize.ts`, `commitment-preprocess.ts`)
- Lubec and Eastport parser fixtures; expanded organized-tax unit tests (23 total)
- `phase:d2c` ETL script; tax source entries for Calais, Eastport, and Machias

### Changed

- Lubec owner joins: 1,585 / 1,894 (83.7%); quality joins: 1,130 / 1,894 (59.7%)
- Organized parcel count on map: 7,801 across four towns (Lubec, Calais, Eastport, Machias)
- Total atlas parcels: 13,197 (5,396 UT + 7,801 organized)
- Parcel detail panel: owner without assessment, parent-lot join note, hide invalid account numbers
- Coverage and organized-towns manifests updated with v3 metrics per town

### Fixed

- Lubec false owners from money suffixes (`ARCS, ROBERT \t43,100`), street headers, and mail-line address traps
- `map_lot_parent` join method missing from `Parcel` type (build failure)
- Forward account-block parser regressions on split headers and homestead lines

### Notes

- Eastport uses FY2023 commitment book (latest publicly posted; grid lot IDs)
- Calais and Machias use 2025 RE commitment books
- D2b (Baileyville, Jonesport, Steuben) deferred; D2d–f rollout continues

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
