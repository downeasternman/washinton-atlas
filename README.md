# Washington County Atlas

An interactive geographic atlas for **Washington County, Maine** — combining public datasets into a single searchable interface for casual exploration and professional research.

> **Working title.** Branding is provisional and will change.

**Repository:** [downeasternman/washinton-atlas](https://github.com/downeasternman/washinton-atlas)

**Current version:** `0.0.2` — see [CHANGELOG.md](./CHANGELOG.md)

## What this is

A hybrid atlas and parcel research tool: explore the county like a map, then inspect ownership and tax attributes where public data is available. Municipal boundaries are a primary browse/filter. Place-name search is the primary jump path.

## Data policy

- Only **publicly obtainable, no-cost** sources are used.
- Every dataset displays **source name** and **as-of date**.
- Tax/ownership data comes from:
  - **Unorganized territories (UT):** state-published PDFs (Phase D1)
  - **Organized towns/cities:** local municipal websites and PDFs (Phase D2)
- Regulatory overlays (flood, wetlands, soils, zoning) are informational only when added later.

## Development gates

Work proceeds in gated phases. Each phase stops for review before the next begins.

| Phase | Scope | Status |
|-------|-------|--------|
| **A** | Scaffold — app shell, map stub, schema stubs | Complete |
| **B** | Boundaries & basemap tiles — accurate, polished county map | Gate B review |
| **C** | Municipality filter + place-name search | Planned |
| **D1** | Unorganized territory tax/ownership ingestion | Planned |
| **D2** | Organized town tax/ownership ingestion | Planned |
| **E** | Coverage honesty, polish, tests | Planned |

## Stack (v1)

- Next.js (App Router) + TypeScript + React
- Tailwind CSS
- MapLibre GL + react-map-gl
- PostgreSQL + PostGIS + Drizzle ORM
- pnpm

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16 + PostGIS 3 (required from Phase C/D onward for search & tax)
- Optional: `tools/pmtiles-bin/pmtiles.exe` (go-pmtiles) for rebuilding tiles

### Setup

```bash
pnpm install
cp .env.example .env
# Edit .env with your DATABASE_URL when ready
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Phase B basemap tiles are checked into `public/tiles/`. To rebuild them:

```bash
pnpm phase:b
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
