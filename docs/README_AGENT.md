# README_AGENT - Single Entry for All Agents

Last updated: 2026-02-06

## Current Objective
- Maintain a single-entry, low-overhead handoff workflow.
- Keep execution focused on `docs/NEXT_STEPS.md`.
- P0 closure is complete; prioritize P1 quality scope:
  - primary CTA actionability
  - image/lint warning reduction
  - placeholder asset replacement on release-critical routes
  - responsive QA evidence + automation follow-up after full-route squeeze hardening
- Update docs only on major changes (behavior/gates/contracts/priorities/risks).

## System Health Snapshot
- Current build state:
  - `npm run build`: pass (`next build --webpack`)
  - `npx tsc --noEmit`: pass **after** build (`.next/types` must exist)
  - `npm run lint`: `0 errors, 20 warnings`
- Current blocking gaps (`P0`): none.
- Known non-blocking debt:
  - image optimization warnings (`@next/next/no-img-element`)
  - CTA behavior completion outside P0-critical paths
  - placeholder/mock visual asset replacement
  - automated e2e coverage

## What Changed Last
- Responsive squeeze mitigation was expanded from core five routes to secondary routes and shared sections:
  - routes:
    - `/about`
    - `/projects`
    - `/projects/[id]`
    - `/cart`
  - shared/layout components:
    - `src/app/components/PageOffset.tsx`
    - `src/app/components/BrandBanner.tsx`
    - `src/app/components/BestSellers.tsx`
    - `src/app/components/ServicesSection.tsx`
    - `src/app/components/CreativeHubSection.tsx`
    - `src/app/components/Footer.tsx`
    - `src/app/components/cart/SampleCartDrawer.tsx`
- Current responsive baseline status:
  - core and secondary release routes now use variable-driven spacing/typography/sticky offsets.
  - low-height (`max-height: 430px`) rules are active via `src/app/globals.css`.
- Responsive squeeze mitigation landed for the core five routes plus global navbar:
  - unified responsive baseline variables in `src/app/globals.css` (fluid typography/spacing + low-height `max-height: 430px` rules)
  - navbar anti-squeeze updates in `src/app/components/Navbar.tsx` (logo clamp, tighter mobile spacing, variable nav heights)
  - content-driven low-height updates in:
    - `src/app/components/Hero.tsx`
    - `src/app/components/ProjectShowcase.tsx`
  - products responsiveness updates in:
    - `src/app/components/ProductSidebar.tsx` (desktop sidebar breakpoint moved to `lg`)
    - `src/app/products/page.tsx`
    - `src/app/products/[slug]/page.tsx`
  - services/contact squeeze fixes in:
    - `src/app/services/page.tsx`
    - `src/app/contact/page.tsx`
  - verification snapshot remained healthy (`build`/`tsc` pass, lint still `0 errors, 20 warnings`)
- P0 implementation and sign-off are complete:
  - `UI-NAV-001` closed (final navbar layout iteration removed overlap near ~1680px).
  - `CART-SAMPLE-001` closed (sample-cart flow operational via detail add -> trolley drawer -> `/cart` -> contact handoff).
- Docs-only release gap audit aligned active docs to current reality.
- `NEXT_STEPS` now includes decision-complete `Sample Cart v1` contract:
  - sample-cart-only scope
  - detail-page entry
  - `product + finish` dedup
  - fixed sample size (`200x100mm`)
  - `localStorage` persistence
  - drawer + `/cart` flow
  - cart-origin `Ask for sample` handoff to `/contact`
- Canonical docs model was established with stable filenames.
- Date-suffixed active docs were retired.
- `HANDOVER_YYYY-MM-DD.md` was removed from active handoff flow and archived at:
  - `docs/archive/HANDOVER_2026-02-06.md`
- Active docs now:
  - `docs/README_AGENT.md`
  - `docs/ARCHITECTURE.md`
  - `docs/NEXT_STEPS.md`
  - `docs/WORKLOG.md`

## Where to Read Next
- If implementing features or fixes:
  - read `docs/NEXT_STEPS.md` first (start with `P1`)
  - then read `docs/WORKLOG.md` for recent context
- If changing data/model/contracts:
  - read `docs/ARCHITECTURE.md` first
  - then read `docs/NEXT_STEPS.md`
- If validating release readiness:
  - read `docs/NEXT_STEPS.md` (`Exit Criteria`, `Verification Commands`, `Test Cases / Scenarios`)
  - then compare with `docs/WORKLOG.md` (`Validation Snapshot`)

## Non-Negotiables
- Agent startup rule:
  - always read this file first (`docs/README_AGENT.md`)
- Conflict resolution:
  - execution precedence: `NEXT_STEPS.md` > `README_AGENT.md` > `WORKLOG.md` > `ARCHITECTURE.md`
  - architecture facts precedence: `ARCHITECTURE.md` is authoritative
- Major-change gate (docs update required):
  - user-visible behavior changes
  - engineering gate status changes (`lint`, `tsc`, `build`)
  - architecture/data contract changes
  - priority/blocker changes (`P0/P1`)
  - new risks that affect handoff safety
- For major changes, update at least:
  - `docs/NEXT_STEPS.md`
  - `docs/WORKLOG.md`
  - `docs/README_AGENT.md`
- Do not create new date-based active docs for next steps/worklog/handover.
- Archive-only rule:
  - historical snapshots go under `docs/archive/`
