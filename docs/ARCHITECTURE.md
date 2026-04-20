# Aushen Web - Architecture Overview

Last updated: 2026-04-20

## Project Type
- Next.js App Router frontend.
- Static-export deployment model (`output: "export"`).
- Runtime uses generated product data + manual override layer.

## Canonical Domain and Hosting
- Canonical public domain contract: `https://aushenstone.com.au/`.
- Canonical URL source in code: `src/lib/seo.ts` (`SITE_URL`).
- GitHub Pages is the publish channel (`dist` -> `gh-pages`), not canonical URL authority.

## Deployment Model
- Build/export baseline (`next.config.ts`):
  - `output: "export"`
  - `trailingSlash: true`
  - `images.unoptimized: true`
- Build command:
  - `npm run build` -> `next build --webpack`
  - `npm run build:pages` -> `next build --webpack && rm -rf dist && cp -R out dist`
- Publish workflow:
  - `.github/workflows/deploy.yml`
  - trigger: `push main` + `workflow_dispatch`
  - publish action: `peaceiris/actions-gh-pages@v4`
  - publish target: `gh-pages` branch, `dist/` folder

## Route Architecture
- Homepage composition: `src/app/page.tsx`.
- Server wrapper routes (metadata ownership):
  - `src/app/about/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/products/page.tsx`
  - `src/app/projects/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/cart/page.tsx`
  - `src/app/terms-condition/page.tsx`
- Client route implementations:
  - `*PageClient.tsx` files under corresponding route folders.

## Dynamic Route Static-Export Contract
- Product detail route:
  - `src/app/products/[slug]/page.tsx`
  - uses `generateStaticParams()` from `PRODUCTS`
  - sets `dynamicParams = false`
- Project detail route:
  - `src/app/projects/[id]/page.tsx`
  - uses fixed static id list in file
  - sets `dynamicParams = false`

## SEO and Indexing Contract
- Metadata utilities: `src/lib/seo.ts`.
- Metadata routes:
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
- Index policy:
  - `/cart`: `noindex,follow`
  - `/projects/[id]`: `noindex,follow`
  - `/products/[slug]`: indexable
  - `/terms-condition`: indexable
- Sitemap content:
  - core static routes, legal static routes, and generated product detail routes.

## Data Model and Flow
- Product source of truth: `../docs/aushen_product_library.csv` (repo root `docs/`).
- Data generation script: `scripts/build-product-data.ts`.
- Data generation command: `npm run build:product-data`.
- Generated outputs:
  - `src/data/products.generated.ts`
  - `src/data/categories.generated.ts`
- Override layer:
  - `src/data/product_overrides.ts`
  - generated image mapping: `src/data/product_images.generated.ts`
- Product photo mapping refresh command: `npm run prepare:product-photos`.
- Generated files are build artifacts and must not be edited manually.
- Blueocean phase-1 split contract:
  - `Blueocean` in the outer CSV continues to generate the continuity slug `blueocean`.
  - `Blueocean Honed` in the outer CSV generates the dedicated slug `blueocean-honed`.
  - Remaining Blueocean special finishes are intentionally still grouped under `blueocean` until a later reclassification pass.

## Product and Cart Contracts
- Product core type: `Product` in `src/types/product.ts`.
- Product detail selector model is application-first (`applicationIndex`), then finish, then size.
- Sample cart contract (`src/types/cart.ts`):
  - storage key: `aushen_sample_cart_v1`
  - prefill handoff key: `aushen_sample_cart_contact_prefill_v1`
  - cleared marker key: `aushen_sample_cart_contact_prefill_cleared_v1`
  - variant key semantics: `productSlug + finishId`
  - line limit: `10`
  - sample size: `200x100mm`

## Contact Submission Contract
- Contact submit client: `src/app/contact/ContactPageClient.tsx`.
- Build-time endpoint env var: `NEXT_PUBLIC_CONTACT_API_URL`.
- CI validates variable shape and checks endpoint string is bundled in `dist`.

## Project Detail Content Contract
- Current project detail content is hard-coded in `src/app/projects/[id]/ProjectDetailClient.tsx`.
- Project detail `project.products[].slug` must align with generated product routes or provide fallback behavior.

## Documentation Model
- Active docs:
  - `docs/README_AGENT.md`
  - `docs/NEXT_STEPS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/WORKLOG.md`
- Active execution board is `docs/NEXT_STEPS.md`.
- Historical implementation detail is `docs/WORKLOG.md`.
- Fact conflicts are resolved by this file and current code.

## Planned Evolution (P2, Not Implemented)
- `ADM-LITE-001` lightweight admin portal remains backlog.
- v1 intent: edit display-layer product overrides only.
- Product structural records remain CSV-driven in v1.

## Pitfalls and Constraints
- CSV parsing relies on multi-row header and forward-filled product context.
- Size parsing is best-effort; ambiguous values keep raw string.
- Static-export dynamic routes require explicit `generateStaticParams` coverage.
- `dist` and generated data files are overwritten by build/generation commands.
- Product photo prep expects raw images referenced by the audit CSV under `AUSHEN Product Photos/`.
