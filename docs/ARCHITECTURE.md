# Aushen Web - Architecture Overview

Last updated: 2026-02-06

## Project Type
- Next.js App Router project.
- Frontend-only app with static data and generated TypeScript data files.

## Planned Evolution (P2 Target; Not Implemented)
- Current architecture remains frontend-only in runtime.
- Planned improvement path (`ADM-LITE-001`):
  - lightweight admin surface under `/admin` for display-content maintenance.
  - single-account login with basic session hardening.
  - GitHub PR-based publish flow (branch/commit/PR), no direct `main` write.
  - product structural records remain CSV-driven in v1; admin scope is display-layer overrides only.

## Directory Structure (High Level)
- `src/app/` contains routes and page-level UI.
- `src/app/components/` contains reusable UI sections and layout components.
- `src/data/` contains generated data and manual overrides.
- `src/types/` contains shared TypeScript types.
- `public/` contains static assets.
- `scripts/` contains data build tooling.
- `docs/` contains project documentation.

## Documentation Workflow
- Single-entry file for all agents: `docs/README_AGENT.md`.
- Canonical active docs:
  - `docs/README_AGENT.md`
  - `docs/ARCHITECTURE.md`
  - `docs/NEXT_STEPS.md`
  - `docs/WORKLOG.md`
- Archived session snapshots belong under `docs/archive/` (not in active execution flow).
- Conflict handling:
  - Execution precedence: `NEXT_STEPS.md` > `README_AGENT.md` > `WORKLOG.md` > `ARCHITECTURE.md`
  - Architecture facts are authoritative in `ARCHITECTURE.md`.

## Routing
- `src/app/page.tsx` is the homepage composition.
- Product list: `src/app/products/page.tsx`
- Product detail: `src/app/products/[slug]/page.tsx`
- Other routes: `about`, `contact`, `services`, `projects`
- Global navbar is rendered in `src/app/layout.tsx` only.

## Data Flow
- Source of truth: `docs/aushen_product_library.csv` (outside app folder).
- Build step: `scripts/build-product-data.ts` parses CSV and generates:
  - `src/data/products.generated.ts`
  - `src/data/categories.generated.ts`
- Manual override layer:
  - `src/data/product_overrides.ts` for tone tags, description, and image overrides.
  - planned editable source (target, not active yet): `src/data/product_overrides.editable.json`
  - Audience-specific content fields for product detail:
    - `homeownerSummary`, `homeownerUseCases`
    - `professionalSummary`, `professionalNotes`
    - `ctaOverride`
  - Placeholder image path: `/Application001.webp`

## Data Contracts (What to Read vs. What to Write)
- **Read from**:
  - `Product.applicationIndex` for application-first UI (application -> finish -> sizes).
  - `Product.finishes` if you need raw finish/application matrix.
- **Write to**:
  - `docs/aushen_product_library.csv` for product inventory changes.
  - `src/data/product_overrides.ts` for tone tags, descriptions, and image mapping.
  - planned (when `ADM-LITE-001` implementation starts): `src/data/product_overrides.editable.json` as admin-editable display source.
- **Do not edit**:
  - `src/data/products.generated.ts` and `src/data/categories.generated.ts` (build artifacts; regenerate instead).

## Planned Admin Contracts (P2 Target; Docs-Only)
- Planned routes:
  - `/admin/login`
  - `/admin`
  - `/admin/products`
  - `/admin/products/:slug`
- Planned APIs:
  - `POST /api/admin/login`
  - `POST /api/admin/logout`
  - `GET /api/admin/products`
  - `GET /api/admin/products/:slug`
  - `POST /api/admin/products/:slug/save-pr`
- Planned core types:
  - `AdminEditableOverride`
  - `AdminSavePrRequest`
  - `AdminSavePrResponse`
  - `AdminSessionUser`
- Planned transition model:
  - display overrides: admin-editable JSON target.
  - product structure (`material/finish/application/size`): stays in CSV pipeline for v1.

## Core Data Types
- `Product`
  - `materialId`, `materialName`
  - `finishes` (finish variants with applications and sizes)
  - `applicationIndex` (application-first index with finishes + sizes)
  - `media` (product photo status + application photo progress)
- `FinishVariant`
  - `slipRating`
  - `applications` (each with sizes)
- `ApplicationIndexEntry`
  - `label` and `category` metadata
  - `finishes` for that application, each with sizes
- `AudienceMode`
  - `"homeowner" | "professional"`

## Product UX
- Product list (`/products`)
  - Uses generated product data.
  - Filters: material, application, tone.
  - Desktop sidebar + mobile drawer share `ProductSidebar`.
  - Mobile drawer supports ESC close, overlay close, and body scroll lock.
  - Placeholder images unless overridden.
- Product detail (`/products/[slug]`)
  - Application-first selector, then finish.
  - Sizes are shown for the selected application+finish.
  - Audience toggle: Homeowner / Professional.
  - CTA priority changes by audience mode.
  - Description and audience copy from overrides, otherwise defaults.

## Layout & Semantics
- `src/app/layout.tsx` contains:
  - Global `Navbar`
  - `GrainOverlay`
  - `PageOffset`
- `PageOffset` uses a `div` wrapper (not `main`) to avoid nested landmark issues.

## Category Sources
- Materials and applications are generated from the CSV into `categories.generated.ts`.
- Navbar and sidebar menus use the generated categories.

## Regenerating Data
From `aushen-web/`:
```bash
npx tsc --target ES2019 --module commonjs --esModuleInterop --outDir /tmp/aushen-scripts scripts/build-product-data.ts
node /tmp/aushen-scripts/build-product-data.js
```

## Pitfalls & Gotchas
- **CSV header format**: 3-row header + forward-filled product fields. Missing this yields wrong grouping.
- **Size values are messy**: mixed formats (`600x400x20/60`, `Random Size x20-30mm`, parentheses). We keep `raw` and only parse clean values.
- **Client components and params**: detail page uses `useParams()`; passing `params` props can be undefined in client components.
- **Generated files are overwritten** on regeneration.
- **Strict lint rules**: `react/no-unescaped-entities`, `no-html-link-for-pages`, `react-hooks/set-state-in-effect` are common sources of dev errors.
- **Build environment**: build command uses webpack mode (`next build --webpack`) in this environment for stability.

## Legacy / Unused
- `src/data/categories.ts` is legacy; the app uses `src/data/categories.generated.ts`.

## Notable Constraints
- CSV contains a matrix of applications and sizes with forward-filled product metadata.
- Size parsing is best-effort and keeps raw size strings when parsing is ambiguous.
- Tone tags and descriptions are not in CSV and must be manually defined.
