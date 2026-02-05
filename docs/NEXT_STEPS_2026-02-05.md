# Handover - Aushen Web

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
- **Lint errors exist outside product work** (not fixed in this session):
  - `react/no-unescaped-entities`
  - `no-html-link-for-pages`
  - `react-hooks/set-state-in-effect`
  - `@typescript-eslint/no-explicit-any`
- Common locations:
  - `src/app/about/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/components/BestSellers.tsx`
  - `src/app/components/ProjectShowcase.tsx`
  - `src/app/components/Preloader.tsx`
  - `src/app/projects/page.tsx`

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
