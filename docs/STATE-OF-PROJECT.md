# Washington County Atlas — State of Project

**As of:** 2026-07-27  
**Released version on `main`:** `0.0.9` (E1 symbology + Machiasport remediation)  
**Working tree:** post-release snapshot

This document is a review snapshot for human perusal: what ships today, gaps, and next gates.

---

## 1. Verdict

| Area | Status |
|------|--------|
| Phases A → D2f | **Released** through `0.0.8` |
| Phase E1 (coverage symbology) | **Released** in `0.0.9` |
| Machiasport owner remediation | **Released** in `0.0.9` |
| Phase E (remainder) | **In progress** |
| Product identity | Hybrid atlas + parcel detail; Washington County ME only; free public data |

**Atlas parcel count:** **31,567** total  
- UT: **5,396**  
- Organized joined layer: **26,171**  
- Organized towns with ownership joins: **24**

---

## 2. Phase gate checklist

| Phase | Scope | Gate status |
|-------|--------|-------------|
| A → D2d | Scaffold through Robbinston | Complete / released |
| D2e | Tier-2 wave | Complete / released (`0.0.7`); Roque Bluffs corrected in `0.0.8` |
| D2f | Remaining small towns | Complete / released (`0.0.8`) |
| **E1** | Parcel coverage symbology + legend | **Complete / released (`0.0.9`)** |
| E | Polish / coverage honesty / tests (remainder) | Pending |

---

## 3. Organized-town ownership (authoritative: `data/manifest/organized-towns.json`)

### Joined — 24 towns

Prior 22 from D2a–D2e, plus D2f Whitneyville and D2e-fix Roque Bluffs.

**Machiasport (`0.0.9` remediation):** map-lot layout parser; 1128/1226 owner joins; 449/1226 quality joins (honest assessment match rate).

Full joined list remains in `organized-towns.json` (`status: "joined"`).

### Failed — 16 towns (geometry noted; no public ownership join)

| Wave | Towns |
|------|--------|
| D2d | Beals |
| D2e | Beddington, Columbia, Danforth, East Machias, Harrington, Jonesboro, Northfield, Princeton |
| D2f | Crawford, Deblois, Dennysville, Meddybemps, Topsfield, Vanceboro, Waite |

### Pending

None for D2 organized ownership rollout.

---

## 4. Recent quality work (`0.0.9`)

- Parcel map symbology by coverage tier and program (exemption, Tree Growth); low-confidence muted fill
- Machiasport: resolve owners from mail lines instead of situs/map headers; institutional `&` names; situs label in detail panel
- Owner validation: geographic place-feature detection (HILL, ISLAND, etc.) without rejecting person names
- UT + organized parsers emit exemption and forest enrollment fields for tile classification

---

## 5. Stack & product constraints (unchanged)

- Next.js App Router, TypeScript, React, Tailwind v4  
- MapLibre GL v5 + react-map-gl/maplibre, PMTiles  
- PostgreSQL/PostGIS/Drizzle stubs; early phases file-backed  
- pnpm  
- Free public data only; no invented assessments; source + as-of on attribute groups  

---

## 6. Useful commands

| Command | Purpose |
|---------|---------|
| `pnpm phase:d2e-roque-bluffs` | Roque commitment + tax-map catalog → join → merge → tiles |
| `pnpm phase:d2f` | Whitneyville → merge → tiles → county report |
| `pnpm etl:org:parse --town=machiasport` | Re-parse Machiasport with map-lot layout |
| `pnpm etl:org:report` | Full organized coverage + county summary |
| `pnpm test` / `pnpm build` | Verify |

---

## 7. Next gate

**Phase E (remainder)** — wedge-fix at low zoom (on hold), organized-town re-parse for exemption/Tree Growth colors county-wide, deferred product items as scoped in project rules.

Review checklist:
- [x] E1 symbology and legend shipped
- [x] Machiasport map-lot owner remediation
- [ ] Low-zoom parcel wedge fix (planned, on hold)
- [ ] County-wide organized re-parse for program colors
