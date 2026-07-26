# Washington County Atlas

An interactive geographic atlas for **Washington County, Maine** — combining public datasets into a single searchable interface for casual exploration and professional research.

> **Working title.** Branding is provisional and will change.

**Repository:** [downeasternman/washinton-atlas](https://github.com/downeasternman/washinton-atlas)

**Current version:** `0.0.3` — see [CHANGELOG.md](./CHANGELOG.md)

## Screenshots

| County overview | Place search | Parcel detail |
|-----------------|--------------|---------------|
| ![Washington County map overview](./docs/screenshots/map-overview.png) | ![Place-name search](./docs/screenshots/place-search.png) | ![Parcel detail panel with tax data](./docs/screenshots/parcel-detail.png) |

## What this is

A hybrid atlas and parcel research tool: explore the county like a map, then inspect ownership and tax attributes where public data is available. Municipal boundaries are a primary browse/filter. Place-name search is the primary jump path.

**Current coverage (v0.0.3):**

- **7,290 parcels** with geometry on the map (5,396 unorganized territory + 1,894 Lubec organized)
- **UT tax joins:** 3,172 / 5,396 parcels with owner and assessed values from Maine Revenue Services 2025 valuation books
- **Organized pilot (Lubec):** 1,054 / 1,894 parcels joined to the 2024 real estate tax commitment book

## Data policy

- Only **publicly obtainable, no-cost** sources are used.
- Every dataset displays **source name** and **as-of date**.
- Tax/ownership data comes from:
  - **Unorganized territories (UT):** Maine Revenue Services state PDFs (Phase D1)
  - **Organized towns/cities:** local municipal commitment PDFs and Maine GeoLibrary parcel geometry (Phase D2)
- Parsed tax values are never invented — null on parse or join failure.
- Regulatory overlays (flood, wetlands, soils, zoning) are informational only when added later.

## Development gates

Work proceeds in gated phases. Each phase stops for review before the next begins.

| Phase | Scope | Status |
|-------|-------|--------|
| **A** | Scaffold — app shell, map stub, schema stubs | Complete |
| **B** | Boundaries & basemap tiles — accurate, polished county map | Complete |
| **C** | Municipality filter + place-name search | Complete |
| **D1** | Unorganized territory tax/ownership ingestion | Complete |
| **D2-SCAFFOLD** | Organized-town pipeline + statewide geometry download | Complete |
| **D2a** | Lubec organized-town pilot | Complete |
| **D2b–f** | Remaining organized towns (town-by-town rollout) | Planned |
| **E** | Coverage honesty, polish, tests | Planned |

## Stack (v1)

- Next.js (App Router) + TypeScript + React
- Tailwind CSS v4
- MapLibre GL v5 + react-map-gl
- PMTiles for vector tiles
- PostgreSQL + PostGIS + Drizzle ORM (schema stubs; file-backed data in early phases)
- pnpm

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16 + PostGIS 3 (optional in early phases; required for full search & tax persistence later)
- Optional: `tools/pmtiles-bin/pmtiles.exe` (go-pmtiles) for rebuilding tiles

### Setup

```bash
pnpm install
cp .env.example .env
# Edit .env with your DATABASE_URL when ready
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Phase B basemap tiles and parcel tiles are checked into `public/tiles/`. To rebuild them:

```bash
pnpm phase:b          # boundaries + basemap
pnpm phase:d1         # UT tax ETL + parcel tiles (requires raw PDFs downloaded)
pnpm phase:d2a        # Lubec organized-town pilot
```

> Tile builds use a Node geojson-vt → MBTiles → PMTiles pipeline (Windows-friendly). Shell wrappers live under `scripts/tiles/`.

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm etl:boundaries` | Download Maine GeoLibrary county/muni boundaries |
| `pnpm etl:osm` | Download county-clipped OSM (roads, water, places) |
| `pnpm tiles:all` | Build `public/tiles/{basemap,boundaries}.pmtiles` |
| `pnpm phase:b` | Run full Phase B ETL + tile pipeline |
| `pnpm phase:c` | Normalize place-name search index |
| `pnpm phase:d1` | UT tax download, parse, join, merge, and parcel tiles |
| `pnpm phase:d2-scaffold` | Download organized-town parcel geometry statewide |
| `pnpm phase:d2a` | Lubec commitment PDF → join → merge → tiles |

## Data sources (high level)

| Layer | Source | Notes |
|-------|--------|-------|
| Municipal boundaries | Maine GeoLibrary | County clip |
| Roads, water, places | OpenStreetMap | County clip |
| UT parcel geometry | Maine Revenue Services GIS | WAP + Day Block layers |
| UT tax | MRS 2025 valuation books (PDF) | Map/lot index crosswalk |
| Organized geometry | Maine GeoLibrary parcels | 34,881 features county-wide |
| Organized tax (Lubec) | Town of Lubec 2024 RE commitment (PDF) | 2025 PDF not text-extractable |

## Out of scope for v1

- Ownership/deed history timelines
- Multi-parcel comparison
- FEMA, wetlands, soils, LUPC as product features
- SearchIQS / registry deed document embedding
- User accounts or paywalls
- Print/PDF export
- Final product branding

## License

TBD.
