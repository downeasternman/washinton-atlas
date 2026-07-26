# Washington County Atlas — State of Project

**As of:** 2026-07-26  
**Released version on `main`:** `0.0.8` (D2f + Roque Bluffs remediation)  
**Working tree:** post-release snapshot

This document is a review snapshot for human perusal: what ships today, gaps, and next gates.

---

## 1. Verdict

| Area | Status |
|------|--------|
| Phases A → D2f | **Released** through `0.0.8` |
| Roque Bluffs (D2e correction) | **Joined** in `0.0.8` |
| Phase E | **Not started** |
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
| **D2f** | Remaining small towns | **Complete / released (`0.0.8`)** |
| E | Polish / coverage honesty / tests | Pending |

---

## 3. Organized-town ownership (authoritative: `data/manifest/organized-towns.json`)

### Joined — 24 towns

Prior 22 from D2a–D2e, plus:

| Wave | Town | Geometry | Owner joins | Quality joins | Source notes |
|------|------|----------|-------------|---------------|--------------|
| D2e fix | Roque Bluffs | 623 | 514 | 491 | 2025 RE from [assessors](https://roquebluffsmaine.us/assessors/); 2024 fallback wired; tax maps cataloged (image-only) |
| D2f | Whitneyville | 256 | 247 | 223 | 2025 RE from Google Sites/Drive; zero-column owner cleanup |

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

## 4. Recent quality work (`0.0.8`)

- Strip trailing Trio `0 0` land/building debris from owners (`sanitizeOwnerName` + parser).
- Reject address-fragment false owners (e.g. `NO. CAMINO`).
- Allow 1-digit account numbers (Roque Bluffs Trio books).
- Whitneyville re-parsed after cleanup: **0** dirty `0 0` owners on geometry.

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
| `pnpm etl:org:report` | Full organized coverage + county summary |
| `pnpm test` / `pnpm build` | Verify |

---

## 7. Next gate

**Phase E** — polish, coverage honesty in UI, tests, deferred product items as scoped in project rules.

Review checklist:
- [x] D2f complete (Whitneyville joined; 7 small towns failed honestly)
- [x] Roque Bluffs onboarded from public assessors PDFs
- [ ] Phase E plan / execute when ready
