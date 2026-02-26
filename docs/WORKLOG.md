# Worklog - Aushen Web

Last updated: 2026-02-26

## Completed and Landed

### Contact Form API Wiring (2026-02-26)
- Scope:
  - turned `/contact` from visual-only CTA into a real API submit flow.
  - added deployment-facing configuration path for static export builds.
- Behavior landed:
  - `/contact` form now posts to `NEXT_PUBLIC_CONTACT_API_URL`.
  - payload includes `firstName`, `lastName`, `email`, `phone`, `message`, `userType`, `source`, and honeypot field `website`.
  - submit lifecycle is visible to user (`Sending...`, success, error fallback message).
  - when API URL is missing, page shows explicit misconfiguration feedback.
- Deployment/config support landed:
  - added `.env.example` with `NEXT_PUBLIC_CONTACT_API_URL` placeholder.
  - GitHub Pages workflow now injects `NEXT_PUBLIC_CONTACT_API_URL` from repository Actions variable.
  - README now documents local + CI setup for contact API endpoint.
- Files updated:
  - `src/app/contact/page.tsx`
  - `.github/workflows/deploy.yml`
  - `.env.example`
  - `README.md`
  - `docs/NEXT_STEPS.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
- Validation:
  - `npm run lint`: pass (`0 errors, 20 warnings`)
  - `npm run build:pages`: pass
- Remaining launch dependency:
  - `LAUNCH-P0-001` remains open until production Worker/Resend endpoint is verified on live domain.

### Launch Cutover Docs Realignment (2026-02-25)
- Scope:
  - documentation alignment only for immediate go-live requirements.
  - no runtime/frontend/backend implementation changes in this pass.
- Why this update:
  - previous docs treated `P0` as fully closed, which conflicts with the new objective (rapid primary-domain cutover from WordPress to current static site).
  - launch-critical tasks (lead capture, redirect migration, SEO baseline, telemetry, rollback) were either missing or mixed into non-blocking quality debt.
- Changes applied:
  - `NEXT_STEPS`:
    - replaced `P0 closed` state with explicit launch blockers (`LAUNCH-P0-001`..`LAUNCH-P0-005`).
    - added overlap dedup rules between launch P0 and existing P1 items.
    - added launch-specific test cases and updated exit criteria.
  - `README_AGENT`:
    - updated objective and blocking-gap snapshot to match launch-cutover P0.
    - clarified that non-contact CTA completion remains P1 after cutover.
- Files updated:
  - `docs/NEXT_STEPS.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
- Behavior/contract impact:
  - none (docs-only planning and prioritization realignment).

### Task B Round 2 - Actionable Contact Links (2026-02-25)
- Scope:
  - converted contact-critical text fields into actionable links on Contact + Footer.
  - introduced single-source contact constants to prevent value drift.
  - kept social homepage links and legal on-request placeholders unchanged.
- Behavior landed:
  - address links now open Google Maps directions target.
  - Contact map visual block is now clickable to the same directions target.
  - phone links now use `tel:+61430799906` while displaying `0430 799 906`.
  - email links now use `mailto:info@aushenstone.com.au`.
  - careers mailto now reuses the same source-of-truth value.
- Files updated:
  - `src/data/contact.ts`
  - `src/app/contact/page.tsx`
  - `src/app/components/Footer.tsx`
  - `docs/NEXT_STEPS.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`

### Task B Round 1 - Contact Field Unification (2026-02-25)
- Scope:
  - unified contact-critical values across Footer + Contact surfaces.
  - updated map destination and careers mailto target.
  - intentionally did not change social homepage links or legal on-request placeholders in this round.
- Final values landed:
  - address: `16a/347 Bay Rd, Cheltenham VIC 3192`
  - phone: `0430 799 906`
  - email: `info@aushenstone.com.au`
  - business hours: `Mon-Fri 8:30am-4:30pm`, `Sat 10:00am-3:00pm`, `Sun Closed`
- Files updated:
  - `src/app/contact/page.tsx`
  - `src/app/components/Footer.tsx`
  - `docs/NEXT_STEPS.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
- Remaining owner-input blockers:
  - social profile destination URLs:
    - `src/app/components/Footer.tsx` (`130`, `131`, `132`, `133`)
  - legal policy published destinations:
    - `src/app/components/Footer.tsx` (`84`, `87`)

### Task A Round 1 - In-Scope Image Replacement (2026-02-25)
- Scope:
  - replaced placeholder visuals for in-scope Task A surfaces only:
    - `/services`, `/about`, `/contact`
  - intentionally not touched in this round:
    - `/projects`, `/projects/[id]`, `/products`, `/products/[slug]`
    - deferred shared placeholders in `Navbar`, `BestSellers`, `ServicesSection`
- Source and outputs:
  - source set provided by user:
    - `/Users/lee/Downloads/aushen-web-photo/{SVC-01..04,ABT-01..04,CNT-01}.png`
  - generated web assets:
    - `public/task-a-2026-02-24/svc-profiling.webp`
    - `public/task-a-2026-02-24/svc-curved.webp`
    - `public/task-a-2026-02-24/svc-bespoke.webp`
    - `public/task-a-2026-02-24/svc-consultation.webp`
    - `public/task-a-2026-02-24/about-hero-quarry.webp`
    - `public/task-a-2026-02-24/about-origin-sourcing.webp`
    - `public/task-a-2026-02-24/about-standard-qc.webp`
    - `public/task-a-2026-02-24/about-place-showroom.webp`
    - `public/task-a-2026-02-24/contact-map-aerial.webp`
  - crop ratios used:
    - services core: `3:2`
    - services consultation: `4:3`
    - about story images: `4:5`
    - contact map visual: `1:1`
- Files updated:
  - `src/app/services/page.tsx`
  - `src/app/about/page.tsx`
  - `src/app/contact/page.tsx`
  - `docs/NEXT_STEPS.md`
  - `docs/WORKLOG.md`
- Result snapshot:
  - replaced slots this round: `9`
  - remaining placeholder slots tracked for next pass: `5`
    - `src/app/components/Navbar.tsx` (`443`)
    - `src/app/components/BestSellers.tsx` (`15`, `21`, `27`)
    - `src/app/components/ServicesSection.tsx` (`13`)
- Policy note:
  - user-approved temporary policy was applied: source images were published without watermark cleanup in this round.

### Docs Convergence - Placeholder Visuals + Contact-Critical Information (2026-02-23)
- Scope:
  - documentation alignment only (`docs/NEXT_STEPS.md`, `docs/README_AGENT.md`, `docs/WORKLOG.md`).
  - no runtime/frontend/backend implementation changes in this pass.
- Why this convergence:
  - placeholder-asset cleanup tasks were previously mixed with wider release-critical scope.
  - contact-critical information cleanup (address/phone/email/hours/map/social) was not represented as a dedicated execution task.
- Changes applied:
  - `NEXT_STEPS` placeholder-related work is now consolidated into two explicit tasks while keeping other tasks unchanged:
    - Task A: non-Project/Product placeholder visual cleanup.
    - Task B: contact-critical information unification.
  - Task boundaries are now explicit:
    - include: `/`, `/services`, `/about`, `/contact` and shared components used by those routes.
    - exclude: `/projects`, `/projects/[id]`, `/products`, `/products/[slug]`.
  - `README_AGENT` objective/debt sections were updated to mirror these two tasks exactly.
- Files updated:
  - `docs/NEXT_STEPS.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
- Behavior/contract impact:
  - none (docs-only restructuring).

### Product Photo Population Phase 1 (2026-02-20)
- Scope implemented:
  - delivered mapped-product image rollout from audit source:
    - input: `docs/photo_audit_2026-02-17/photo_audit_all_in_one.csv` (`status=mapped` rows only)
    - output web assets: `public/product-photos/*.webp`
    - output mapping data: `src/data/product_images.generated.ts`
    - output publish summary: `docs/photo_audit_2026-02-17/summary_after_publish.txt`
  - added deterministic image-prep pipeline:
    - new script `scripts/prepare-product-photos.py`
    - conversion target: `max-side=1600`, `quality=80` (WEBP)
    - naming: `/product-photos/{slug}-{index}.webp`
    - ordering rule for multi-image products:
      - `manual_confirmed_by_user` > `exact_name` > `name_alias` > `base_name_plus_variant` > `image_path` lexical
  - extended product override contract for gallery support:
    - `ProductOverride.imageUrls?: string[]` added
    - `src/data/product_overrides.ts` now merges:
      - generated image overrides (`imageUrl` + `imageUrls`)
      - manual override layer (tone/copy/cta and optional image overrides)
  - product UI behavior updates:
    - `/products` card image source now uses:
      - `override.imageUrls[0]` -> `override.imageUrl` -> placeholder
    - `/products/[slug]` now supports detail-image carousel:
      - arrows + dot navigation
      - no autoplay
      - placeholder fallback preserved
- Files updated:
  - `scripts/prepare-product-photos.py`
  - `src/data/product_images.generated.ts`
  - `src/data/product_overrides.ts`
  - `src/types/product.ts`
  - `src/app/products/page.tsx`
  - `src/app/products/[slug]/ProductDetailClient.tsx`
  - `public/product-photos/` (generated assets)
  - `docs/photo_audit_2026-02-17/summary_after_publish.txt`
  - `package.json`
- Data/result snapshot:
  - mapped rows processed: `63`
  - generated web images: `63`
  - covered product slugs: `54`
  - missing source files during publish prep: `0`
  - products without mapped image remain on placeholder (current known gap set from audit):
    - `angola-black`
    - `barwon`
    - `classic-light-travertine-artmar`
    - `jasper`
    - `kakadu`
    - `philadelphia-silver-travertine-cross-cut-tumbled`
    - `roman`
    - `turkish-carrara-aqua-blue`
- Validation:
  - `npm run lint`: pass (`0 errors, 20 warnings`)
  - `npm run build`: pass
  - `npm run build:pages`: pass

### Navbar Desktop Visibility Rebalance (2026-02-10)
- Scope implemented:
  - changed desktop navbar visibility from `min-[1600px]` to `lg` (`1024px`) so standard desktop widths keep full navigation.
  - replaced natural-wrap desktop nav behavior with deterministic split rows for mid desktop widths.
  - aligned display behavior into three tiers:
    - `<1024`: mobile drawer menu
    - `1024-1535`: desktop two-row nav (`2+2`)
    - `>=1536`: desktop single-row nav
  - moved `Get in Touch` out of desktop left nav while retaining `Contact` on desktop right and preserving `Get in Touch` in mobile drawer.
- Files updated:
  - `src/app/components/Navbar.tsx`
  - `docs/NEXT_STEPS.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
- Behavior/contract changes:
  - desktop navigation now appears on common laptop/desktop widths without forcing hamburger fallback.
  - deterministic row split removes the previous `4+1` orphan item behavior near threshold widths.
  - mega menu and mobile-overlay visibility breakpoints are synchronized with `lg/2xl` desktop strategy.
- Validation:
  - `npm run lint`: pass (`0 errors, 20 warnings`)
  - `npm run build`: pass

### Product UX Density + Audience-Flow Consolidation (2026-02-10)
- Scope implemented:
  - reduced showroom-style visual weight and increased product discovery density.
  - reprioritized audience controls so top-of-page decisions focus on selection + CTA.
- Files updated:
  - `src/app/products/page.tsx`
  - `src/app/products/[slug]/ProductDetailClient.tsx`
  - `docs/ARCHITECTURE.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
  - `docs/NEXT_STEPS.md`
- Behavior/contract changes:
  - `/products`:
    - replaced artistic hero + masonry with compact finder layout.
    - added compact header + live result count.
    - added top toolbar filters: keyword search (product/material/application text match), material dropdown, application dropdown.
    - tone filter remains data-driven and auto-hides when no tone options exist.
    - switched to fixed-density responsive card grid (`1/2/3/4` columns) with product name/material/application chips.
  - `/products/[slug]`:
    - compressed top hero and retained `left 5 / right 7` content ratio.
    - uses native dropdown selectors for `Application`, `Surface Finish`, and `Size`.
    - selector chaining reset remains (`application -> finish -> size`).
    - moved `View Mode` to a low-priority footer-adjacent section.
    - audience switch now affects audience notes copy only.
    - CTA stack is fixed homeowner-priority for stable sample-cart flow.
    - `Technical Specifications` remains in the secondary technical card (`defaultOpen` unchanged).
    - sample-cart behavior remains unchanged (`product + finish` key).
- Validation:
  - `npm run lint`: pass (`0 errors, 20 warnings`)
  - `npm run build`: pass

### GitHub Pages Deployment Integration + CI Compatibility Hotfix (2026-02-10)
- Scope implemented:
  - static export deployment baseline for GitHub Pages root-path hosting.
  - dynamic route wrappers for export-safe param generation.
  - CI install compatibility mitigation for peer dependency conflict.
- Files updated:
  - `.github/workflows/deploy.yml`
  - `next.config.ts`
  - `package.json`
  - `.gitignore`
  - `.npmrc`
  - `eslint.config.mjs`
  - `README.md`
  - `src/app/products/[slug]/page.tsx`
  - `src/app/products/[slug]/ProductDetailClient.tsx`
  - `src/app/projects/[id]/page.tsx`
  - `src/app/projects/[id]/ProjectDetailClient.tsx`
- Behavior/contract changes:
  - `build:pages` now outputs `dist` (`out` copied to `dist`) for publish.
  - `/products/[slug]` and `/projects/[id]` are now statically generated via `generateStaticParams`.
  - unknown dynamic params are no longer runtime-resolved (`dynamicParams = false`).
  - deploy publishes `dist` to `gh-pages` on `main` push and manual dispatch.
- Validation:
  - `npm run build`: pass
  - `npm run lint`: pass with existing warnings (`0 errors, 20 warnings`)
  - `npm run build:pages`: pass
  - `npm ci`: local environment may timeout; CI uses `--legacy-peer-deps` workaround.

### Docs Correction + Lightweight Admin Roadmap (2026-02-06)
- Scope:
  - documentation alignment only (`docs/NEXT_STEPS.md`, `docs/README_AGENT.md`, `docs/WORKLOG.md`, `docs/ARCHITECTURE.md`).
  - no runtime/frontend/backend feature implementation in this pass.
- Corrections applied:
  - `NEXT_STEPS` CTA inventory corrected to match current code reality:
    - removed `Order Free Sample` from open CTA gaps (`src/app/products/[slug]/page.tsx` already operational).
    - removed navbar trolley/cart interaction from open CTA gaps (`src/app/components/Navbar.tsx` + sample-cart drawer already operational).
- Roadmap additions (improvement, not bug):
  - added `ADM-LITE-001` in `NEXT_STEPS` (`P2 / Backlog`):
    - lightweight admin concept (`/admin`, single-account login).
    - editable scope limited to display-layer overrides (no CSV structural editing in v1).
    - GitHub PR-based save/publish flow (no direct `main` writes).
  - added planned contract blocks in `NEXT_STEPS`:
    - route/service/type contracts
    - security baseline
    - data flow and failure handling
    - admin-specific acceptance scenarios
- Constraint confirmation:
  - this update is docs-only by decision.
  - implementation phases remain sequenced in backlog and are not started.

### Responsive Squeeze Mitigation Extension (2026-02-06)
- Scope implemented:
  - expanded route coverage:
    - `src/app/about/page.tsx`
    - `src/app/projects/page.tsx`
    - `src/app/projects/[id]/page.tsx`
    - `src/app/cart/page.tsx`
  - expanded shared component coverage:
    - `src/app/components/PageOffset.tsx`
    - `src/app/components/BrandBanner.tsx`
    - `src/app/components/BestSellers.tsx`
    - `src/app/components/ServicesSection.tsx`
    - `src/app/components/CreativeHubSection.tsx`
    - `src/app/components/Footer.tsx`
    - `src/app/components/cart/SampleCartDrawer.tsx`
- Responsive behavior alignment:
  - sticky offsets standardized to CSS variable (`--content-sticky-top`) across newly updated routes/components.
  - title/button spacing and tracking tightened on narrow and low-height viewports.
  - mobile-first stacking applied where two-column button/info layouts caused squeeze.
- Validation:
  - `npm run build`: pass
  - `npx tsc --noEmit`: pass (run after build)
  - `npm run lint`: `0 errors, 20 warnings`

### Session Wrap-Up (首尾总结, 2026-02-06)
- 起点（首）:
  - issue focus was responsive squeeze under small width/height, with core five routes prioritized first.
  - target matrix was locked to `320/360/390/768/1024` plus low-height landscape (`height <= 430px`).
- 终点（尾）:
  - responsive hardening now covers release routes and shared high-impact sections/components.
  - engineering gates are green (`build`, `tsc`, `lint` with existing warnings only).
  - Playwright responsive smoke suite is explicitly deferred into `docs/NEXT_STEPS.md` for next cycle implementation.

### Responsive Squeeze Mitigation Session (2026-02-06)
- Scope implemented:
  - core five route responsive hardening:
    - `/` (hero + project showcase)
    - `/products` (sidebar breakpoint and masonry density)
    - `/products/[slug]` (CTA/spec grids and sticky offset behavior)
    - `/services` (hero density and CTA stacking)
    - `/contact` (hero/form spacing and submit button behavior)
  - global navbar anti-squeeze updates for small width + low height.
  - responsive baseline variables were introduced in `src/app/globals.css`, including low-height tuning for `max-height: 430px`.
- Updated files:
  - `src/app/globals.css`
  - `src/app/components/Navbar.tsx`
  - `src/app/components/Hero.tsx`
  - `src/app/components/ProjectShowcase.tsx`
  - `src/app/components/ProductSidebar.tsx`
  - `src/app/products/page.tsx`
  - `src/app/products/[slug]/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/contact/page.tsx`
- Validation:
  - `npm run build`: pass
  - `npx tsc --noEmit`: pass (run after build)
  - `npm run lint`: `0 errors, 20 warnings`

### Session Summary (from retired handover)
- Mobile navigation drawer in `Navbar` is now fully functional (open/close/ESC/focus trap/scroll lock/ARIA).
- Services interaction is now touch-safe (click/focus-driven, no longer hover-only dependent).
- `/projects/[id]` now reads dynamic params and resolves content by slug with fallback.
- Engineering blockers were removed:
  - lint errors cleared
  - typecheck errors cleared
  - build stabilized in this environment

### Product Data and Product UX Foundation
- CSV-driven product pipeline is in place:
  - `scripts/build-product-data.ts`
  - `src/data/products.generated.ts`
  - `src/data/categories.generated.ts`
- Product list/detail are data-driven with override support:
  - `src/app/products/page.tsx`
  - `src/app/products/[slug]/page.tsx`
  - `src/data/product_overrides.ts`
  - `src/types/product.ts`

### UI/UX Hardening and Stability Work
- Implemented mobile drawer navigation in:
  - `src/app/components/Navbar.tsx`
- Updated Services interaction model in:
  - `src/app/services/page.tsx`
- Refactored dynamic project detail handling in:
  - `src/app/projects/[id]/page.tsx`
- Removed dead navigation patterns (`/login`, `href="#"`) in:
  - `src/app/components/Navbar.tsx`
  - `src/app/components/Footer.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/projects/[id]/page.tsx`
- Added responsive utility/sticky guardrails in:
  - `src/app/globals.css`
  - `src/app/projects/page.tsx`
  - `src/app/components/ProductSidebar.tsx`
  - `src/app/products/[slug]/page.tsx`
  - `src/app/services/page.tsx`
- Cleared lint/type blockers in:
  - `src/app/components/BestSellers.tsx`
  - `src/app/components/ProjectShowcase.tsx`
  - `src/app/components/Preloader.tsx`
  - `src/app/components/CreativeHubSection.tsx`
  - `src/app/components/Footer.tsx`
  - `src/app/components/ServicesSection.tsx`
  - `src/app/components/SmoothScroll.tsx`
- Removed build-time Google font dependency and stabilized build command in:
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `package.json`

## Docs-Only Release Gap Audit (2026-02-06)
- Scope: documentation alignment only (`docs/NEXT_STEPS.md`, `docs/WORKLOG.md`, `docs/README_AGENT.md`).
- Code changes: none in this audit pass.
- Outcome:
  - release blockers were reclassified and made explicit in `NEXT_STEPS`:
    - `UI-NAV-001` (navbar overlap at `md` widths)
    - `CART-SAMPLE-001` (trolley/sample-cart flow missing)
  - primary CTA gaps were expanded into a concrete route/component inventory.
  - placeholder asset debt was elevated to release-readiness tracking.
  - responsive QA tracking model was formalized as:
    - `Static Risk` (code-level risk)
    - `Confirmed Defect` (visual evidence attached)

### Sample Cart v1 Decisions Locked in Docs
- Trolley is now defined as the primary entry to a sample cart funnel, not a decorative icon.
- Scope decisions:
  - sample cart only (no checkout/payment/pricing/inventory)
  - add from product detail only
  - variant key: `product + finish`
  - sample size fixed at `200x100mm`
  - max 1 sample per finish, max 10 lines total
  - persistence via `localStorage`
  - UI: right drawer + dedicated `/cart` page
  - submit: cart-origin `Ask for sample` handoff to `/contact` with message-field prefill

## P0 Implementation Session (2026-02-06)
- Scope implemented:
  - `UI-NAV-001`: navbar overlap mitigation by moving desktop nav visibility to `min-[1600px]`, switching lower widths to mobile menu, and reserving logo center space in a 3-column grid layout.
  - `CART-SAMPLE-001`: sample-cart core flow with typed cart model, global provider, drawer, `/cart` page, detail-page sample add, and contact prefill handoff.
- New files:
  - `src/types/cart.ts`
  - `src/app/components/cart/SampleCartProvider.tsx`
  - `src/app/components/cart/SampleCartDrawer.tsx`
  - `src/app/cart/page.tsx`
- Updated files:
  - `src/app/layout.tsx`
  - `src/app/components/Navbar.tsx`
  - `src/app/products/[slug]/page.tsx`
  - `src/app/contact/page.tsx`
- Validation:
  - `npm run build`: pass
  - `npx tsc --noEmit`: pass
  - `npm run lint`: `0 errors, 20 warnings`

## P0 Closure Confirmation (2026-02-06)
- Manual QA feedback confirmed the previous overlap around ~1680px, then a second navbar iteration was landed.
- Final P0 sign-off:
  - `UI-NAV-001`: closed
  - `CART-SAMPLE-001`: closed
- Result: no open P0 blockers remain; execution focus moves to P1 quality backlog.

## Validation Snapshot
- `npm run build`: pass (`next build --webpack`)
- `npx tsc --noEmit`: pass **after** build; cold start may fail if `.next/types` has not been generated.
- `npm run lint`: `0 errors, 20 warnings`
- `npm run build:pages`: pass (`out` -> `dist`)

## Decisions Made
- Documentation model switched to stable canonical files:
  - `docs/README_AGENT.md`
  - `docs/ARCHITECTURE.md`
  - `docs/NEXT_STEPS.md`
  - `docs/WORKLOG.md`
- `HANDOVER_YYYY-MM-DD.md` is retired from active flow and moved to archive.
- Major-change gate policy is active:
  - update docs only when behavior, engineering gates, architecture/contracts, priorities, or risk posture materially change.
- Conflict precedence is standardized:
  - Execution precedence: `NEXT_STEPS.md` > `README_AGENT.md` > `WORKLOG.md` > `ARCHITECTURE.md`
  - Architecture facts: `ARCHITECTURE.md` is authoritative.
- Release-readiness criteria now explicitly include:
  - primary CTA actionability
  - trolley/sample-cart funnel completeness
  - responsive nav integrity at mobile/tablet widths
- Docs now define target interface contracts for Sample Cart v1:
  - route contract (`/cart`, cart-origin contact handoff)
  - client storage contract (`aushen_sample_cart_v1`)
  - interaction contract (navbar trolley count and cart-origin `Ask for sample`)

## Pruned/Closed Items
- Closed: mobile hamburger menu blocker.
- Closed: services hover-only interaction issue.
- Closed: project detail route not consuming params.
- Closed: blocking lint/type/build failures.
- Closed: dead `/login` link and `href="#"` placeholders in active navigation.
- Closed: date-suffixed `NEXT_STEPS` and `WORKLOG` as active documents.
- Closed: standalone `HANDOVER` as an active required document.
