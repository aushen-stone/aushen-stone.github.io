# README_AGENT - Single Entry for All Agents

Last updated: 2026-02-25

## Current Objective
- Maintain a single-entry, low-overhead handoff workflow.
- Keep execution focused on `docs/NEXT_STEPS.md`.
- P0 closure is complete; prioritize P1 quality scope:
  - primary CTA actionability
  - image/lint warning reduction
  - Task A: placeholder visual cleanup on non-Project/Product routes/components (`/`, `/services`, `/about`, `/contact`)
  - Task B: contact-critical information unification (address/phone/email/hours/map/social)
  - GitHub Pages deployment reproducibility and dependency-compat cleanup
  - responsive QA evidence + automation follow-up after full-route squeeze hardening
- Maintain a P2 lightweight-admin roadmap for non-engineering content updates (docs-only at this stage).
- Update docs only on major changes (behavior/gates/contracts/priorities/risks).

## System Health Snapshot
- Current build state:
  - `npm run build`: pass (`next build --webpack`)
  - `npx tsc --noEmit`: pass **after** build (`.next/types` must exist)
  - `npm run lint`: `0 errors, 20 warnings`
  - `npm run build:pages`: pass (static export + `dist` output)
- Current blocking gaps (`P0`): none.
- Known non-blocking debt:
  - image optimization warnings (`@next/next/no-img-element`)
  - CTA behavior completion outside P0-critical paths
  - non-project/non-product placeholder visual inventory replacement (Task A in `NEXT_STEPS`)
  - contact-critical value inconsistency across Footer/Contact + map/social destination cleanup (Task B in `NEXT_STEPS`)
  - automated e2e coverage
  - temporary `legacy-peer-deps` fallback for `npm ci` (React 19 + `@studio-freight/react-lenis` peer declaration mismatch)
  - content maintenance still depends on engineering workflow (CSV + code changes + deploy)

## What Changed Last
- Task A round 1 image replacement landed (2026-02-25):
  - replaced `9` in-scope placeholders on `/services`, `/about`, and `/contact` using local assets in `public/task-a-2026-02-24/`.
  - deferred `5` placeholder slots remain tracked in `NEXT_STEPS` (`Navbar`, `BestSellers`, `ServicesSection`).
  - temporary policy applied this round: source images were published without watermark cleanup.
- Docs convergence finalized (2026-02-23):
  - placeholder and information-cleanup work in `NEXT_STEPS` is now consolidated into two explicit tasks:
    - Task A: non-Project/Product placeholder visuals.
    - Task B: contact-critical information unification.
  - all other roadmap items remain in place; this change is docs-only.
- Navbar desktop visibility rebalance finalized (2026-02-10):
  - desktop nav now appears from `1024px` (`lg`) instead of waiting for ultra-wide screens.
  - `1024-1535` uses deterministic two-row split navigation (`2+2`), and `>=1536` returns to single-row desktop nav.
  - desktop left nav removes `Get in Touch`; right-side `Contact` remains; mobile drawer keeps `Get in Touch`.
  - validation: `npm run lint` (`0 errors, 20 warnings`) and `npm run build` both pass.
- Product UX refresh finalized (2026-02-10):
  - `/products` now uses compact finder layout (top toolbar filters + fixed-density grid).
  - `/products/[slug]` now keeps `View Mode` in a low-priority footer-adjacent section.
  - audience switch affects audience notes only; CTA stack is fixed homeowner-priority.
  - validation: `npm run lint` (`0 errors, 20 warnings`) and `npm run build` both pass.
- GitHub Pages deployment baseline is active (2026-02-10):
  - static export + dynamic route `generateStaticParams` wrappers are in place.
  - publish path is `build:pages` -> `dist` -> `gh-pages`.
  - CI install still relies on `legacy-peer-deps` fallback until dependency compatibility cleanup.
- Documentation hygiene:
  - `README_AGENT` keeps high-signal current-state summaries only.
  - detailed implementation history remains in `docs/WORKLOG.md`.

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
