# Changelog

All notable changes to Washington County Atlas are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
