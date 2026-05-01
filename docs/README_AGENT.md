# README_AGENT - Single Entry for All Agents

Last updated: 2026-05-01

## Purpose
- Keep handoff low-overhead and execution-focused.
- Agent startup rule: read this file first.
- Active read order:
  1. `docs/NEXT_STEPS.md` (active execution board)
  2. `docs/ARCHITECTURE.md` (stable facts and contracts)
  3. `docs/WORKLOG.md` (historical detail)

## Canonical Environment
- Canonical public domain: `https://aushenstone.com.au/`.
- GitHub Pages is the hosting/publish channel (`build:pages -> dist -> Pages artifact -> actions/deploy-pages`), not the canonical domain contract.
- Canonical URL source in code: `src/lib/seo.ts` (`SITE_URL`).

## Fact Ownership Matrix
- Current code is the runtime truth for implemented behavior.
- `docs/ARCHITECTURE.md` owns current stable contracts, route inventory, deployment model, data flow, SEO/indexing, and integration boundaries.
- `docs/NEXT_STEPS.md` owns active execution priorities, blockers, statuses, owners, evidence, exit criteria, and docs impact.
- `docs/README_AGENT.md` owns startup context, current risk snapshot, and agent operating rules.
- `docs/WORKLOG.md` is historical implementation context only; old entries can be stale and must not override current code or `docs/ARCHITECTURE.md`.
- `README.md` owns developer quickstart, local commands, and deploy setup notes.

## Current Objective
- Launch `aushenstone.com.au` with safe WordPress cutover.
- Close launch blockers tracked in `NEXT_STEPS` (`LAUNCH-P0-001`..`LAUNCH-P0-005`).
- Keep advertising/marketing feedback tracked under `MKT-*` items in `NEXT_STEPS`; marketing-originated active items carry the `marketing` tag.
- Keep P1 quality work active without blocking cutover, except explicitly elevated risks.
- Preserve the new accessories architecture as a first-class inner-repo section.
- Phase 1 accessories scope is `Chemforce`, `HIDE`, and `FormBoss`; `Mapei` stays deferred.

## Health Snapshot (2026-05-01)
- `npm run docs:check`: pass
- `npm run lint`: pass (`0 errors, 23 warnings`)
- `npm run build`: pass
- `npx tsc --noEmit`: pass (after build)
- `npm run build:pages`: pass
- Product catalog/photo generation was not rerun in this docs sync; current inspected state is `72` generated products, `67` products with mapped images, and `5` products missing mapped images.

## Catalog Continuity Notes
- Product structural source of truth remains outer-repo CSV: `../docs/aushen_product_library.csv`.
- `blueocean` is the phase-1 continuity slug and still carries `Sawn` plus remaining Blueocean special finishes.
- `blueocean-honed` is a first-class product slug generated from `Blueocean Honed` rows in the outer CSV.
- Public display naming is override-layer only: `blueocean` displays as `BlueOcean Sawn`; `blueocean-honed` displays as `BlueOcean Honed`; CSV product names and route slugs remain unchanged.
- Blueocean photo audit mapping is intentionally split:
  - `SAI/Blueocean Sawn.jpg` -> `blueocean`
  - `SAI/Blueocean Honed.jpg` -> `blueocean-honed`
- Remaining Blueocean special-finish reclassification is deferred and tracked in `docs/NEXT_STEPS.md`.
- Travertine supplier suffixes are public-display overrides only:
  - `beige-travertine-sai` -> `Beige Travertine`
  - `classic-travertine-sai` -> `Classic Travertine`
  - `premium-classic-travertine-artma` -> `Premium Classic Travertine`
  - `silver-travertine-artma` -> `Silver Travertine`
  - keep those slugs stable unless a separate redirect/slug migration task is explicitly planned.
- `classic-light-travertine-artmar` was removed from the product CSV and generated product catalog on 2026-04-27.
- Product browsing state is URL-led:
  - `/products` filter params are `q`, `material`, `application`, and `tone`; old `category` links remain readable but should not be emitted by new code.
  - `/products/[slug]` selector params are `application`, `finish`, and `size`, validated on the client against generated product data.
  - product-list return context uses `sessionStorage` key `aushen_products_return_context_v1`; product-detail contact prefill uses `aushen_product_contact_prefill_v1`.
- Accessories are curated separately from CSV-generated stone products, with legacy Aushen accessories coverage used as the minimum Phase 1 baseline.
- Accessories source files live inside the inner repo:
  - type contract: `src/types/accessory.ts`
  - curated content source: `src/data/accessories.ts`
  - routes: `src/app/accessories/page.tsx`, `src/app/accessories/[slug]/page.tsx`
- Accessories use enquiry-driven CTAs and must not be forced into the stone sample-cart workflow.
- Continuity reasoning for accessories should stay in docs and handoff notes; public pages should stay customer-facing and avoid migration language.
- Successful `/contact` submissions push `contact_form_submit` to `window.dataLayer` and route to `/thank-you/`; production GA4/GTM validation remains under `LAUNCH-P0-004`.
- Production contact delivery target is Cloudflare Worker + Resend; `NEXT_PUBLIC_CONTACT_API_URL` is configured in GitHub Actions repository variables.

## Active Risk Snapshot
- `LAUNCH-P0-001` contact submit delivery: `Done` (production delivery owner-checked; Cloudflare Worker + Resend).
- `LAUNCH-P0-003` crawl/index baseline validation: `Done` (production robots/sitemap/meta checked; GSC HTML verification and `/sitemap.xml` submission succeeded).
- `LAUNCH-P0-004` GA4 + Search Console validation: `Blocked` (telemetry owner/access pending).
- `LAUNCH-P0-005` cutover + rollback runbook: `Blocked` (runbook owner and dry-run pending).
- `P1-DATA-LINK-001` project detail product-link mismatch: `Open` (project product slugs can route to non-generated product paths).
- `P1-PROJECT-AUTH-001` project showcase authenticity/indexing risk: `Open` (`/projects` is indexable while project content is still hard-coded/mock).
- `P1-IMG-001` remaining non-project/non-product placeholder visual: `Open` (`ServicesSection` templating image only).
- Marketing board: `MKT-P0-001`, `MKT-P1-001`, `MKT-P1-002`, and `MKT-P1-003` are `Done`; `MKT-P3-003` proof assets are `In Progress` with approved claims documented in `docs/MARKETING_PROOF_ASSETS.md`; remaining marketing items stay in `NEXT_STEPS` with `marketing` tags.

## Documentation Consistency Rules
- Active docs must not use line-number-based tracking.
- Active status vocabulary is fixed: `Open`, `Blocked`, `In Progress`, `Done`.
- Each active risk item must include `Owner`, `Evidence`, `Exit Criteria`, and `Docs Impact`.
- Marketing-originated active items must include `Tags: marketing`.
- Fact conflicts are resolved by `docs/ARCHITECTURE.md` and current code.
- `npm run docs:check` must pass before handoff when route, deploy, sitemap, contact-conversion, or active-task schema facts change.
- Execution precedence for active intent:
  - `NEXT_STEPS.md` > `README_AGENT.md`
  - `WORKLOG.md` is historical context only.
  - Architecture facts precedence: current code + `ARCHITECTURE.md`.

## Update Gate (When Docs Must Be Updated)
- User-visible behavior change.
- Engineering gate state change (`lint`, `build`, `tsc`, `build:pages`).
- Architecture/data contract change.
- Priority or blocker change (`P0/P1/P2`).
- New handoff risk affecting execution safety.
- Touching any of these paths requires a docs check and either a docs update or an explicit final note that no docs change was required:
  - `src/app/**/page.tsx`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `.github/workflows/**`
  - `src/data/**`
  - `scripts/build-*`
  - contact, analytics, GTM, and conversion-tracking code

## Active vs History Split
- Keep active execution intent in `docs/NEXT_STEPS.md` only.
- Keep architectural facts/contracts in `docs/ARCHITECTURE.md` only.
- Keep implementation history and retrospective detail in `docs/WORKLOG.md`.
- Do not create new date-based active handover docs.
