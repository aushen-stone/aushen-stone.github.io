# Aushen Web - Architecture Overview

Last updated: 2026-04-27

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
  - `src/app/accessories/page.tsx`
  - `src/app/accessories/[slug]/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/products/page.tsx`
  - `src/app/projects/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/cart/page.tsx`
  - `src/app/terms-condition/page.tsx`
- Client route implementations:
  - `*PageClient.tsx` files under corresponding route folders.

## Dynamic Route Static-Export Contract
- Accessories detail route:
  - `src/app/accessories/[slug]/page.tsx`
  - uses `generateStaticParams()` from `ACCESSORY_BRANDS`
  - sets `dynamicParams = false`
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
  - core static routes, legal static routes, accessories routes, and generated product detail routes.

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
  - display-only product names can be supplied through `ProductOverride.displayName`
- Product photo mapping refresh command: `npm run prepare:product-photos`.
- Generated files are build artifacts and must not be edited manually.
- Blueocean phase-1 split contract:
  - `Blueocean` in the outer CSV continues to generate the continuity slug `blueocean`.
  - `Blueocean Honed` in the outer CSV generates the dedicated slug `blueocean-honed`.
  - Public display names are override-layer only: `blueocean` displays as `BlueOcean Sawn`, and `blueocean-honed` displays as `BlueOcean Honed`.
  - Remaining Blueocean special finishes are intentionally still grouped under `blueocean` until a later reclassification pass.
- Travertine supplier suffix display contract:
  - CSV/generated names for supplier-distinguished travertine SKUs can retain suffixes such as `(SAI)` and `(Artma)` to preserve continuity slugs and image mapping keys.
  - Public-facing product names remove those supplier suffixes through `src/data/product_display_names.ts`.
- Removed catalog item:
  - `Classic Light Travertine(Artmar)` was removed from the CSV source and generated product data on 2026-04-27.

## Accessories Architecture
- Accessories are a first-class site section inside the inner repo and are not treated as a subcase of the outer-CSV stone catalog.
- Stone products continue to be generated from the outer CSV; accessories are curated through dedicated inner-repo pages, navigation, and supporting content.
- Accessory source files:
  - `src/types/accessory.ts`
  - `src/data/accessories.ts`
- Runtime entry points:
  - accessories index: `src/app/accessories/page.tsx`
  - accessories brand page: `src/app/accessories/[slug]/page.tsx`
- Page renderer files:
  - `src/app/accessories/AccessoriesIndexPageClient.tsx`
  - `src/app/accessories/AccessoryBrandPageRenderer.tsx`
- Navigation and indexing touchpoints:
  - `src/app/components/Navbar.tsx`
  - `src/app/components/Footer.tsx`
  - `src/app/sitemap.ts`
- Phase 1 accessories coverage includes:
  - `Chemforce`
  - `HIDE`
  - `FormBoss`
- `Mapei` remains a later candidate and is intentionally deferred until a separate accessories expansion pass.
- The old Aushen-covered accessories content on the legacy site is the minimum coverage baseline for Phase 1.
- Data-contract intent:
  - accessories are modeled as brand-led landing pages with curated family and item content.
  - accessories are not generated from the outer CSV.
  - accessories do not participate in the stone sample-cart contract.
  - continuity and migration notes belong in docs and internal review context, not in public-facing accessory page copy.

## Product and Cart Contracts
- Product core type: `Product` in `src/types/product.ts`.
- Product detail selector model is application-first (`applicationIndex`), then finish, then size.
- Product list browser state:
  - `/products` uses client query params `q`, `material`, `application`, and `tone` for shareable filters.
  - legacy inbound `category` params are still read as compatibility input, but new filter interactions write the normalized params and remove `category`.
  - clicking a product card stores a short-lived return context in `sessionStorage` under `aushen_products_return_context_v1` with `href`, `productSlug`, `scrollY`, and `savedAt`.
  - returning from a product detail page restores the exact filtered list URL and prioritizes scrolling the original product card into view.
- Product detail browser state:
  - `/products/[slug]` supports selector query params `application`, `finish`, and `size`.
  - selector params are validated against the current generated product before use, and invalid combinations are normalized to available options.
  - product detail canonical metadata remains the slug route; selector params are client-side UI state only.
- Product detail contact handoff:
  - product enquiry/consultation CTAs write the current product, application, finish, size, slip rating, and page URL to `sessionStorage` under `aushen_product_contact_prefill_v1`.
  - `/contact?source=product-detail` reads that handoff as the initial message and clears it after successful submit.
- Accessories intentionally bypass the `Product` selector contract and use direct enquiry CTAs instead of sample ordering.
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
