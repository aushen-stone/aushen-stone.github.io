# Next Steps - Aushen Web

Last updated: 2026-02-06

## Context
This repo is a Next.js App Router frontend. The Aushen product library is sourced from `docs/aushen_product_library.csv` (outside the app directory) and compiled into typed TypeScript data used by the UI.

## What Was Completed
- Implemented CSV → typed data pipeline.
  - Script: `scripts/build-product-data.ts`
  - Generated outputs: `src/data/products.generated.ts`, `src/data/categories.generated.ts`
- Added shared product types in `src/types/product.ts`.
- Added manual override layer in `src/data/product_overrides.ts`.
- Updated:
  - Product list `/products` to use generated data and filters.
  - Product detail `/products/[slug]` to be application-first (Application → Finish → Sizes).
  - Navbar + sidebar to use generated categories.
- Fixed “Stone not found” by using `useParams()` in the detail page (client component).
- Added docs:
  - `docs/WORKLOG_2026-02-05.md`
  - `docs/ARCHITECTURE.md`

## Key Decisions
- Product granularity = **Product Name** (finish + slip rating are variants).
- UX order = **Application-first**, not finish-first.
- Categories (material + application) are generated from CSV.
- Tone tags + descriptions are manual overrides (not in CSV).
- Product images use a shared placeholder by default (`/Application001.webp`), override per slug later.

## Regenerate Data
From `aushen-web/`:
```bash
npx tsc --target ES2019 --module commonjs --esModuleInterop --outDir /tmp/aushen-scripts scripts/build-product-data.ts
node /tmp/aushen-scripts/build-product-data.js
```

## How to Extend Product Data
- Update inventory in `docs/aushen_product_library.csv`, then regenerate.
- Add tone tags, descriptions, and images in `src/data/product_overrides.ts`.

## Known Issues / Follow-ups
- **Lint errors still exist outside product work**:
  - `react/no-unescaped-entities`
  - `no-html-link-for-pages`
  - `react-hooks/set-state-in-effect`
- Common locations:
  - `src/app/components/BestSellers.tsx`
  - `src/app/components/Preloader.tsx`
  - `src/app/components/ProjectShowcase.tsx`
- Current full lint snapshot (2026-02-06):
  - `3 errors, 24 warnings`
- Current full build snapshot:
  - `npm run build` can fail in restricted network because `next/font/google` cannot fetch fonts.

## Pitfalls / Gotchas
- CSV uses 3-row headers + forward-filled rows. Missing this breaks grouping.
- Size strings are inconsistent; parsing is best-effort, raw strings are preserved.
- Generated files are overwritten on regeneration.
- Client components cannot rely on `params` props; use `useParams()`.

## Quick Pointers
- Data types: `src/types/product.ts`
- Generated data: `src/data/products.generated.ts`, `src/data/categories.generated.ts`
- Overrides: `src/data/product_overrides.ts`
- Product list: `src/app/products/page.tsx`
- Product detail: `src/app/products/[slug]/page.tsx`

---

## Next Steps After Product UX Pass

### 1) Convert Product Media to `next/image` (Performance)
- Current state: product pages intentionally still use `<img>` with lint suppression for product files.
- Next action:
  - Migrate product list/detail images to `next/image`.
  - Configure `images.remotePatterns` in `next.config.ts` if external sources are introduced in overrides.

### 2) Fill Product Overrides for Audience Content
- Current state: new audience fields are available but mostly using defaults.
- Next action:
  - Populate `homeownerSummary`, `homeownerUseCases`, `professionalSummary`, and `professionalNotes` for top SKUs first.
  - Set per-product `ctaOverride` only where sales language should differ.

### 3) Improve Mobile Product Discovery
- Current state: mobile filtering works through a drawer.
- Next action:
  - Add active-filter chips above results for quick removal.
  - Add filter result count inside the drawer header.

### 4) Continue Global Lint Cleanup (Out of Product Scope)
- Remaining warnings/errors outside product surfaces still exist.
- Suggested order:
  - `src/app/components/BestSellers.tsx` and `src/app/components/ProjectShowcase.tsx` (`<a>` -> `<Link>`).
  - `src/app/components/Preloader.tsx` (`setState` in effect pattern).
  - Remaining quote escaping and type strictness in legacy pages.

### 5) Build Reliability in Restricted Networks
- Current state: `npm run build` can fail when Google Fonts cannot be fetched.
- Next action:
  - Move to local font hosting (`next/font/local`) for deterministic offline/CI builds.
