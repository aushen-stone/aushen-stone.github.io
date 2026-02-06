# Next Steps - Aushen Web

Last updated: 2026-02-06

## Current Release Goal
Stabilize post-P0 quality by finishing primary CTA behavior, reducing image/lint debt, replacing placeholder assets, and extending responsive hardening beyond the newly-fixed core five routes while keeping engineering gates reproducible in this environment.

## P0 (Release Blockers)
No open P0 blockers.

### Closed P0 Items (2026-02-06)
- `UI-NAV-001` closed:
  - navbar layout refactored to a reserved center-logo grid structure.
  - desktop nav supports wrapping and now only appears from `min-[1600px]`; below that uses mobile menu.
  - overlap around ~1680px and nearby widths was resolved via final UX-first iteration.
- `CART-SAMPLE-001` closed:
  - sample-cart flow implemented end-to-end:
    - product detail add sample
    - navbar trolley live count
    - right-side sample drawer
    - dedicated `/cart` page
    - `/contact?source=sample-cart` message prefill handoff

## Sample Cart v1 (Implemented Contract)
- Business mode: sample cart only (no payment, pricing, stock, checkout).
- Entry point: only product detail page can add samples (`src/app/products/[slug]/page.tsx`).
- Variant key: `product + finish`.
- Sample size: fixed `200x100mm`.
- Dedup rule: same `productSlug + finishId` merges into one line.
- Quantity rules:
  - max 1 sample per finish line.
  - max 10 lines per request.
- Persistence: `localStorage`.
- UI shape:
  - navbar trolley opens right-side drawer.
  - drawer links to dedicated `/cart` page.
- Submit action:
  - `Ask for sample` is initiated only from cart.
  - cart -> `/contact` handoff pre-fills message field only.
- Explicitly out of scope for v1:
  - direct add from `/products` list page.
  - any payment/checkout flow.

## P1

### 1) Stabilize primary CTA behavior for production
- Problem: several primary CTAs are visual-only.
- Current unimplemented CTA inventory:
  - `src/app/components/Hero.tsx` (`Make Appointments`)
  - `src/app/components/CreativeHubSection.tsx` (`Book A Consultation`, `Book The Space`)
  - `src/app/services/page.tsx` (`Book a Consultation`, `Contact Us`, `Visit Showroom`)
  - `src/app/contact/page.tsx` (`Send Message` form submit)
  - `src/app/products/[slug]/page.tsx` (`Order Free Sample`, `Enquire`, `Book Consultation`, `Call Us`)
  - `src/app/components/Footer.tsx` (newsletter submit)
  - `src/app/components/BestSellers.tsx` (`Quick View`)
  - `src/app/components/Navbar.tsx` (trolley/cart interaction)
- Action: each primary CTA must either navigate, submit, or be explicitly disabled with clear copy.
- Definition of Done: no ambiguous primary CTA states remain.

### 2) Reduce remaining lint warnings (image optimization)
- Problem: `eslint` has `0 errors` but `20 warnings` (`@next/next/no-img-element`).
- Action: migrate high-impact visual assets from `<img>` to `next/image`, then configure image host policy in `next.config.ts`.
- Definition of Done: warnings are cleared or explicitly documented with rationale.

### 3) Replace placeholder and mock visual assets on release-critical routes
- Problem:
  - default product image fallback (`/Application001.webp`) is heavily used.
  - `src/data/product_overrides.ts` currently has no active product override entries.
  - multiple routes still rely on generic Unsplash placeholders.
- Action:
  - prioritize real assets for `/products`, `/products/[slug]`, `/projects`, `/projects/[id]`, `/services`, `/about`, `/contact`.
  - track unresolved placeholders in docs until replaced.
- Definition of Done: release-critical pages no longer depend on obvious placeholder imagery.

### 4) Consolidate responsive QA baseline
- Problem: route-level squeeze fixes are now broadly landed, but visual evidence and automated regression coverage are still incomplete.
- Implemented now:
  - responsive baseline variables + low-height rule (`max-height: 430px`) in `src/app/globals.css`
  - navbar squeeze hardening in `src/app/components/Navbar.tsx`
  - route updates in:
    - `src/app/components/Hero.tsx`
    - `src/app/components/ProjectShowcase.tsx`
    - `src/app/components/ProductSidebar.tsx`
    - `src/app/products/page.tsx`
    - `src/app/products/[slug]/page.tsx`
    - `src/app/services/page.tsx`
    - `src/app/contact/page.tsx`
    - `src/app/about/page.tsx`
    - `src/app/projects/page.tsx`
    - `src/app/projects/[id]/page.tsx`
    - `src/app/cart/page.tsx`
  - shared-section updates in:
    - `src/app/components/PageOffset.tsx`
    - `src/app/components/BrandBanner.tsx`
    - `src/app/components/BestSellers.tsx`
    - `src/app/components/ServicesSection.tsx`
    - `src/app/components/CreativeHubSection.tsx`
    - `src/app/components/Footer.tsx`
    - `src/app/components/cart/SampleCartDrawer.tsx`
- Action:
  - use two evidence classes in tracking:
    - `Static Risk`: code-level risk not yet visually confirmed.
    - `Confirmed Defect`: reproduced with screenshot/video.
  - keep sticky offsets synchronized with navbar conventions (CSS variable driven).
  - attach screenshot/video evidence for each target viewport matrix checkpoint.
- Definition of Done:
  - 320/360/390/768/1024 checks plus horizontal low-height checks (`height <= 430px`) show no horizontal overflow and no sticky overlap regressions across release routes.
  - static-risk items are either confirmed or closed.

### 5) Add Playwright responsive smoke regression (deferred to next cycle)
- Problem: responsive squeeze fixes are code-complete, but regression protection still relies on manual checks.
- Scope (routes):
  - `/`
  - `/products`
  - `/products/[slug]` (pick one stable slug from generated data)
  - `/services`
  - `/contact`
  - `/about`
  - `/projects`
  - `/projects/[id]` (pick one stable slug from fixture/mock list)
  - `/cart`
- Viewport matrix:
  - portrait widths: `320/360/390/768/1024`
  - low-height landscape: `height <= 430px` (at least one `812x375`-class viewport)
- Core assertions:
  - no horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`)
  - key nav elements are visible and non-overlapping (menu/logo/cart area)
  - drawers still open/close correctly (`Navbar` menu, product filter drawer, sample cart drawer)
  - primary CTA blocks are rendered and clickable in compact layouts
- CI integration target:
  - add a dedicated `playwright:smoke:responsive` command
  - run on PR for frontend-touching changes, with artifact upload (screenshots/videos) on failure
- Definition of Done:
  - smoke suite is stable in CI (>= 3 consecutive green runs)
  - at least one intentional layout break is caught locally by the suite
  - responsive QA checklist references automated smoke report links instead of manual-only evidence

## P2 / Backlog

### 1) Replace mock project detail content with a typed data source
- Problem: `/projects/[id]` route behavior is correct, but content remains hard-coded.
- Files:
  - `src/app/projects/[id]/page.tsx`
- Action: move project detail content into typed data module or CMS source.
- Definition of Done: content updates do not require editing route component logic.

### 2) Add automated UI regression coverage
- Problem: mobile nav, product filter drawer, and dynamic route behavior rely on manual checks.
- Files:
  - `src/app/components/Navbar.tsx`
  - `src/app/products/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/projects/[id]/page.tsx`
- Action: add e2e coverage (Playwright or equivalent) for menu/drawer flow, routing, and key CTA paths.
- Definition of Done: CI catches regressions for open/close behavior, focus flow, and route-driven rendering.

### 3) Add e2e coverage for Sample Cart v1
- Problem: sample-cart behavior is high-risk and stateful.
- Action: add e2e checks for add/merge/limit/persist/handoff flow.
- Definition of Done: CI validates core sample-cart scenarios listed below.

## Public APIs / Interfaces / Types (Target Contract; Docs-Only)

### Route Contract
- `GET /cart`
  - sample-cart overview/edit page.
- `GET /contact`
  - supports cart-origin prefill for message content (sample line summary).

### Client Storage Contract
- Storage key: `aushen_sample_cart_v1`
- Item shape:
  - `productSlug`
  - `productName`
  - `finishId`
  - `finishName`
  - `sampleSize: "200x100mm"`
  - `addedAt`

### Interaction Contract
- Navbar trolley displays live count as number of unique finish lines.
- `Ask for sample` action is initiated from cart only (single funnel).

## Test Cases / Scenarios
1. Add same product + same finish twice on detail page: cart remains one line.
2. Add same product with different finishes: cart shows separate lines.
3. Add over limit (`>10` lines): addition is blocked with user-facing feedback.
4. Refresh page: cart contents persist (`localStorage`).
5. Click trolley: drawer opens; drawer can navigate to `/cart`.
6. Click `Ask for sample` in cart: navigates to `/contact` with message prefilled.
7. `/products` list page has no direct sample add entry.
8. Navbar has no logo/menu overlap at threshold widths (including ~1600 and ~1680).
9. Release routes (`/`, `/products`, `/products/[slug]`, `/services`, `/contact`, `/about`, `/projects`, `/projects/[id]`, `/cart`) show no squeeze at 320/360/390/768/1024 and no low-height overlap at `height <= 430px`.
10. `build -> tsc -> lint` command sequence reproduces expected health state.

## Assumptions and Defaults
1. No payment, pricing, inventory, or order lifecycle in current phase.
2. Sample request is the only cart business objective in v1.
3. Responsive issue tracking uses static audit first, then screenshot confirmation.
4. Responsive squeeze mitigation is implemented for core and secondary release routes; remaining work is evidence collection and automation.

## Exit Criteria
- P0 blockers (`UI-NAV-001`, `CART-SAMPLE-001`) are closed.
- Primary CTAs are actionable, or explicitly marked unavailable with clear copy.
- `npm run build` passes.
- `npx tsc --noEmit` passes after build (required for `.next/types` presence).
- `npm run lint` reports no errors (warnings are tracked until resolved).
- Mobile/tablet widths (320/360/390/768/1024) and low-height landscape (`height <= 430px`) show no critical nav/overlay regressions on release routes.

## Verification Commands
```bash
npm run build
npx tsc --noEmit
npm run lint
```

Manual smoke:
```bash
npm run dev
```
Then verify:
- mobile menu open/close via button, overlay, and ESC
- trolley drawer open/close and `/cart` navigation path
- detail-page sample add behavior (merge + max-10 limit + persistence)
- cart `Ask for sample` handoff to `/contact` with message prefill
- `/projects/[id]` renders by slug and returns fallback for unknown id
