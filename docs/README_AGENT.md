# README_AGENT - Single Entry for All Agents

Last updated: 2026-04-20

## Purpose
- Keep handoff low-overhead and execution-focused.
- Agent startup rule: read this file first.
- Active read order:
  1. `docs/NEXT_STEPS.md` (active execution board)
  2. `docs/ARCHITECTURE.md` (stable facts and contracts)
  3. `docs/WORKLOG.md` (historical detail)

## Canonical Environment
- Canonical public domain: `https://aushenstone.com.au/`.
- GitHub Pages is the hosting/publish channel (`build:pages -> dist -> gh-pages`), not the canonical domain contract.
- Canonical URL source in code: `src/lib/seo.ts` (`SITE_URL`).

## Current Objective
- Launch `aushenstone.com.au` with safe WordPress cutover.
- Close launch blockers tracked in `NEXT_STEPS` (`LAUNCH-P0-001`..`LAUNCH-P0-005`).
- Keep P1 quality work active without blocking cutover, except explicitly elevated risks.
- Preserve the new accessories architecture as a first-class inner-repo section.
- Phase 1 accessories scope is `Chemforce`, `HIDE`, and `FormBoss`; `Mapei` stays deferred.

## Health Snapshot (2026-04-20)
- `npm run build:product-data`: pass
- product-photo mapping refresh: pass (raw photo root was unavailable in this workspace, so a temporary source tree was reconstructed from published `public/product-photos/`)
- `npm run lint`: pass (`0 errors, 23 warnings`)
- `npm run build`: pass
- `npx tsc --noEmit`: pass (after build)
- `npm run build:pages`: pass

## Catalog Continuity Notes
- Product structural source of truth remains outer-repo CSV: `../docs/aushen_product_library.csv`.
- `blueocean` is the phase-1 continuity slug and still carries `Sawn` plus remaining Blueocean special finishes.
- `blueocean-honed` is a first-class product slug generated from `Blueocean Honed` rows in the outer CSV.
- Blueocean photo audit mapping is intentionally split:
  - `SAI/Blueocean Sawn.jpg` -> `blueocean`
  - `SAI/Blueocean Honed.jpg` -> `blueocean-honed`
- Remaining Blueocean special-finish reclassification is deferred and tracked in `docs/NEXT_STEPS.md`.
- Accessories are curated separately from CSV-generated stone products, with legacy Aushen accessories coverage used as the minimum Phase 1 baseline.
- Accessories source files live inside the inner repo:
  - type contract: `src/types/accessory.ts`
  - curated content source: `src/data/accessories.ts`
  - routes: `src/app/accessories/page.tsx`, `src/app/accessories/[slug]/page.tsx`
- Accessories use enquiry-driven CTAs and must not be forced into the stone sample-cart workflow.
- Continuity reasoning for accessories should stay in docs and handoff notes; public pages should stay customer-facing and avoid migration language.

## Active Risk Snapshot
- `LAUNCH-P0-001` contact submit delivery: `Blocked` (production endpoint validation pending).
- `LAUNCH-P0-002` legacy URL redirects: `Blocked` (redirect owner/ruleset pending).
- `LAUNCH-P0-003` crawl/index baseline validation: `In Progress` (code baseline landed; production verification pending).
- `LAUNCH-P0-004` GA4 + Search Console validation: `Blocked` (telemetry owner/access pending).
- `LAUNCH-P0-005` cutover + rollback runbook: `Blocked` (runbook owner and dry-run pending).
- `P1-DATA-LINK-001` project detail product-link mismatch: `Open` (project product slugs can route to non-generated product paths).

## Documentation Consistency Rules
- Active docs must not use line-number-based tracking.
- Active status vocabulary is fixed: `Open`, `Blocked`, `In Progress`, `Done`.
- Each active risk item must include `Owner`, `Evidence`, and `Exit Criteria`.
- Fact conflicts are resolved by `docs/ARCHITECTURE.md` and current code.
- Execution precedence for active docs:
  - `NEXT_STEPS.md` > `README_AGENT.md` > `WORKLOG.md` > `ARCHITECTURE.md`
  - Architecture facts precedence: `ARCHITECTURE.md` is authoritative.

## Update Gate (When Docs Must Be Updated)
- User-visible behavior change.
- Engineering gate state change (`lint`, `build`, `tsc`, `build:pages`).
- Architecture/data contract change.
- Priority or blocker change (`P0/P1/P2`).
- New handoff risk affecting execution safety.

## Active vs History Split
- Keep active execution intent in `docs/NEXT_STEPS.md` only.
- Keep architectural facts/contracts in `docs/ARCHITECTURE.md` only.
- Keep implementation history and retrospective detail in `docs/WORKLOG.md`.
- Do not create new date-based active handover docs.
