# Washington County Atlas — State of Project

**As of:** 2026-07-26  
**Released version on `main`:** `0.0.7` (D2e included)  
**Working tree:** clean after release (see git)

This document is a review snapshot for human perusal: what ships today, what is done in the workspace, gaps, and next gates.

---

## 1. Verdict

| Area | Status |
|------|--------|
| Phases A → D2e | **Released** through `0.0.7` |
| Phase D2f | **Not started** (8 pending towns) |
| Phase E | **Not started** |
| Product identity | Hybrid atlas + parcel detail; Washington County ME only; free public data |

**Atlas parcel count (local merge after D2e + Wesley):** **30,688** total  
- UT: **5,396** (D1; ~3,172 with owner + assessment)  
- Organized joined layer: **~25,292** geometry rows in merge (22 towns with ownership joins + geometry-only failed towns still present in organized geometry)

---

## 2. Phase gate checklist

| Phase | Scope | Gate status |
|-------|--------|-------------|
| A | Scaffold | Complete / released |
| B | Basemap + boundaries | Complete / released |
| C | Muni filter + place search | Complete / released |
| D1 | UT tax/ownership | Complete / released |
| D2-SCAFFOLD | Organized geometry + pipeline | Complete / released |
| D2a | Lubec | Complete / released |
| D2b | Baileyville, Jonesport, Steuben | Complete / released |
| D2c | Calais, Eastport, Machias | Complete / released |
| D2d | Addison…Robbinston (+ Beals failed) | Complete / released (`0.0.6`) |
| **D2e** | Tier-2 wave (16 towns) | **Complete / released (`0.0.7`)** |
| D2f | Remaining small towns | Pending |
| E | Polish / coverage honesty / tests | Pending |

---

## 3. Organized-town ownership (authoritative: `data/manifest/organized-towns.json`)

### Joined — 22 towns

| Wave | Town | Geometry | Owner joins | Quality joins | Source notes |
|------|------|----------|-------------|---------------|--------------|
| D2a | Lubec | 1,894 | 1,585 | 1,130 | 2024 book (2025 PDF not text-extractable) |
| D2b | Baileyville | 1,361 | 1,236 | 1,040 | 2024–25 RE |
| D2b | Jonesport | 1,579 | 1,227 | 1,028 | 2025 RE |
| D2b | Steuben | 1,605 | 1,321 | 1,145 | 2025 RE |
| D2c | Calais | 2,771 | 2,251 | 1,875 | 2025–26 RE |
| D2c | Eastport | 1,983 | 1,673 | 1,391 | FY2023 (newest public) |
| D2c | Machias | 1,153 | 1,031 | 859 | 2025 RE |
| D2d | Addison | 1,419 | 1,306 | 1,072 | Commitment book |
| D2d | Charlotte | 466 | 412 | 360 | Commitment book |
| D2d | Cooper | 370 | 289 | 244 | 2022 book (newest public) |
| D2d | Cutler | 624 | 542 | 448 | Commitment book |
| D2d | Milbridge | 1,692 | 731 | 600 | Low rate — possible `R##` vs GeoLibrary keys |
| D2d | Pembroke | 1,006 | 879 | 785 | Commitment book |
| D2d | Perry | 1,006 | 852 | 703 | Commitment book |
| D2d | Robbinston | 607 | 582 | — | **Owner-only** (index + transfer PDFs; assessments null) |
| D2e | Alexander | 840 | 509 | 446 | 2025 RE |
| D2e | Cherryfield | 1,018 | 1,015 | 949 | 2020 book (newest public PDF) |
| D2e | Columbia Falls | 515 | 460 | 408 | 2026 map/lot book |
| D2e | Machiasport | 1,226 | 1,131 | 1,002 | 2025 map/lot book |
| D2e | Marshfield | 425 | 419 | 395 | 2024 text (2025 image-only) |
| D2e | Wesley | 828 | 593 | 574 | 2025 text PDF; letter-grid join |
| D2e | Whiting | 904 | 903 | 745 | 2025 RE |

### Failed — 10 towns (geometry may exist; no usable public ownership join)

| Wave | Town | Reason |
|------|------|--------|
| D2d | Beals | No public commitment / owner list |
| D2e | Beddington | No public commitment PDF found |
| D2e | Columbia | No public commitment PDF found |
| D2e | Danforth | Tax maps only |
| D2e | East Machias | No public commitment PDF found |
| D2e | Harrington | Annual report only (no commitment book) |
| D2e | Jonesboro | No public commitment PDF found |
| D2e | Northfield | Page references 2025 book; no text-extractable PDF |
| D2e | Princeton | No public commitment PDF found |
| D2e | Roque Bluffs | No public commitment PDF found |

### Pending — D2f (8)

Crawford, Deblois, Dennysville, Meddybemps, Topsfield, Vanceboro, Waite, Whitneyville.

---

## 4. Stack & product constraints (unchanged)

- Next.js App Router, TypeScript, React, Tailwind v4  
- MapLibre GL v5 + react-map-gl/maplibre, PMTiles  
- PostgreSQL/PostGIS/Drizzle stubs; early phases file-backed  
- pnpm  
- Free public data only; cite source + as-of; never invent assessments  
- Full-bleed map; coastal Maine look; no accounts in v1  

**Out of scope for v1:** ownership history, multi-parcel compare, regulatory overlays as product, accounts/paywalls, print/PDF export, final branding.

---

## 5. Key technical artifacts

| Path | Role |
|------|------|
| `public/tiles/{basemap,boundaries,parcels}.pmtiles` | Map tiles (parcels rebuilt after D2e) |
| `data/manifest/organized-towns.json` | Town wave/status/sources |
| `data/manifest/tax-sources.json` | Citation registry |
| `data/manifest/coverage.json` | Per-muni honesty flags |
| `lib/tax/commitment-parser.ts` | MRS commitment parser v3 (+ Cutler / Cherryfield / land-first) |
| `lib/tax/map-lot-normalize.ts` | Join-key padding, R/U (Cherryfield), Wesley letter-grid |
| `lib/tax/robbinston-*.ts` | Owner index + RETTD transfer overlay |
| `pnpm phase:d2a` … `phase:d2e` | Wave ETL entrypoints |

---

## 6. Release alignment

`0.0.7` includes D2e joins, parser/normalize remediations, parcel tiles, and this state document. README/CHANGELOG match the 22 joined organized towns and **30,688** atlas parcels.

---

## 7. Known quality / remediation notes

| Issue | Severity | Notes |
|-------|----------|--------|
| Milbridge join rate ~43% | Medium | Likely map-lot key mismatch (`R##` / GeoLibrary) |
| Alexander ~61% owner join | Medium | GIS includes odd keys (`888-0`, `*-999`) |
| Wesley ~72% owner join | Medium | Letter-grid + bare IDs; many keys join; remainder may be true GIS mismatch |
| Dirty owner strings (`… 0 0`, street-like names) | Low–medium | Parser edge cases; assessments not invented |
| Robbinston assessments | Expected | Null by design (no commitment book) |
| Image-only PDFs | Process | Lubec 2025, Marshfield 2025, Wesley Drive 2024 — use newest **text** public PDF |
| Failed D2e towns | Data gap | May reopen if towns publish books later |

---

## 8. Review checklist (for you)

- [ ] Confirm D2e town join/fail decisions (especially Cherryfield 2020 book, Wesley letter-grid joins)  
- [ ] Confirm failed-town list is acceptable for v1 honesty  
- [ ] Decide: **release D2e now** (`bump edit push`) vs continue to **D2f** first  
- [ ] Spot-check UI: Robbinston owner-without-assessment; a high-join D2e town (e.g. Whiting / Cherryfield)  
- [ ] Optional remediations: Milbridge keys; Beals/Northfield if new sources appear  

---

## 9. Suggested next actions

1. **Ship D2e:** bump → `0.0.7`, update CHANGELOG + README coverage table, commit, push.  
2. **Or continue:** `ENTER EXECUTE MODE` / plan for **D2f** (8 remaining towns).  
3. Later **Phase E:** coverage polish, e2e gates, doc/screenshot refresh.

---

## 10. Commands (local)

```bash
pnpm dev
pnpm test
pnpm build
pnpm phase:d2e          # re-run D2e ETL (Wesley parse/join; no Drive download)
pnpm etl:org:report --town=<id>
```

---

*Generated for review. Not a substitute for CHANGELOG; reflects workspace state including unreleased D2e.*
