# README_AGENT - Single Entry for All Agents

Last updated: 2026-02-06

## Current Objective
- Maintain a single-entry, low-overhead handoff workflow.
- Keep execution focused on `docs/NEXT_STEPS.md`.
- Update docs only on major changes (behavior/gates/contracts/priorities/risks).

## System Health Snapshot
- Current build state:
  - `npm run lint`: `0 errors, 20 warnings`
  - `npx tsc --noEmit`: pass
  - `npm run build`: pass
- Known non-blocking debt:
  - image optimization warnings (`@next/next/no-img-element`)
  - CTA behavior completion
  - automated e2e coverage

## What Changed Last
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
  - read `docs/NEXT_STEPS.md` first
  - then read `docs/WORKLOG.md` for recent context
- If changing data/model/contracts:
  - read `docs/ARCHITECTURE.md` first
  - then read `docs/NEXT_STEPS.md`
- If validating release readiness:
  - read `docs/NEXT_STEPS.md` (`Exit Criteria`, `Verification Commands`)
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
