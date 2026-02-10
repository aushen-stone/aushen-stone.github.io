# Worklog - Aushen Web

Last updated: 2026-02-10

## Completed and Landed

### Product Detail Audience-Control Reprioritization (2026-02-10)
- Scope implemented:
  - retained `View Mode` but reduced its decision weight in product detail flow.
  - kept technical data placement after the primary selection/CTA block.
- Files updated:
  - `src/app/products/[slug]/ProductDetailClient.tsx`
  - `docs/ARCHITECTURE.md`
  - `docs/README_AGENT.md`
  - `docs/WORKLOG.md`
  - `docs/NEXT_STEPS.md`
- Behavior/contract changes:
  - removed upper-card `View Mode` block from the detail decision area.
  - fixed CTA stack to homeowner-priority sequence regardless of audience switch.
  - moved audience summary/bullets + `View Mode` toggle into a low-priority section before footer.
  - audience switch now updates audience notes copy only and no longer changes CTA order.
  - `Technical Specifications` remains in the secondary technical card (`defaultOpen` unchanged).
- Validation:
  - `npm run lint`: pass (`0 errors, 20 warnings`)
  - `npm run build`: pass

### Product UI Density Refresh - List + Detail (2026-02-10)
- Scope implemented:
  - reduced "showroom" visual weight and increased information density for product discovery.
  - aligned product list and detail interactions with one-page scanning + faster selection.
- Files updated:
  - `src/app/products/page.tsx`
  - `src/app/products/[slug]/ProductDetailClient.tsx`
- Behavior/contract changes:
  - `/products`:
    - removed artistic hero + masonry flow.
    - added compact header with live result count.
    - added top toolbar filters: keyword search (product/material/application text match), material dropdown, application dropdown.
    - tone filter remains data-driven and is hidden automatically when no tone options exist.
    - switched card layout to fixed-density responsive grid (`1/2/3/4` columns) with product name/material/application chips.
  - `/products/[slug]`:
    - compressed top hero section.
    - changed desktop content ratio to `left 5 / right 7`.
    - reduced left media footprint to a single product image.
    - migrated `Application`, `Surface Finish`, and `Size` to native `<select>` controls.
    - added selector reset chaining:
      - application change resets finish + size to first valid options.
      - finish change resets size to first valid option.
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
