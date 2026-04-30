# Aushen Web

Aushen Stone frontend built with Next.js App Router.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Build and quality commands

```bash
npm run build:product-data
npm run docs:check
npm run build
npm run lint
npm run build:pages
```

`build:pages` performs a static export and copies `out/` to `dist/` for GitHub Pages publishing.
`docs:check` validates that active docs stay synchronized with current route, deployment, sitemap, and contact-conversion contracts.

## Product data and photo regeneration

- Product source of truth lives outside the web repo at `../docs/aushen_product_library.csv`.
- Rebuild generated catalog data after CSV edits:

```bash
npm run build:product-data
```

- Rebuild published product-photo mappings after audit CSV changes:

```bash
python3 -m pip install Pillow
npm run prepare:product-photos
```

- `prepare:product-photos` expects the raw source photo tree at `AUSHEN Product Photos/` plus audit rows in `docs/photo_audit_2026-02-17/photo_audit_all_in_one.csv`.
- Blueocean phase-1 split convention:
  - `blueocean` remains the continuity slug.
  - `blueocean-honed` is the dedicated honed product slug.
  - Remaining Blueocean special finishes still sit under `blueocean` until a later reclassification pass.

## Canonical domain and hosting model

- Canonical public domain: `https://aushenstone.com.au/`.
- Canonical metadata/sitemap source in code: `src/lib/seo.ts` (`SITE_URL`).
- GitHub Pages is the publish channel (`dist` uploaded as a Pages artifact), not the canonical domain contract.

## Contact form API configuration

The `/contact` form submits to `NEXT_PUBLIC_CONTACT_API_URL`.

Local development:

```bash
cp .env.example .env.local
```

Set:

```bash
NEXT_PUBLIC_CONTACT_API_URL=https://<your-worker>.<your-subdomain>.workers.dev/contact
```

GitHub Pages workflow build:

1. Go to `Settings -> Secrets and variables -> Actions -> Variables`.
2. Add repository variable `NEXT_PUBLIC_CONTACT_API_URL`.
3. Use the full endpoint URL including `/contact`.

## Google Tag Manager

Google Tag Manager is injected globally from `src/app/layout.tsx`.

- Default container ID in code: `GTM-NNH55QC`
- Optional override env var: `NEXT_PUBLIC_GTM_ID`

Local development:

```bash
cp .env.example .env.local
```

Set or override:

```bash
NEXT_PUBLIC_GTM_ID=GTM-NNH55QC
```

## GitHub Pages deployment channel

Deployment workflow file:

- `.github/workflows/deploy.yml`

Triggers:

- push to `main`
- manual run via `workflow_dispatch`

Workflow steps:

1. `npm ci`
2. `npm run lint`
3. `npm run docs:check`
4. `npm run build:pages`
5. Upload `dist/` as the Pages artifact
6. Deploy via `actions/deploy-pages`

## Required repository settings (manual)

1. Go to `Settings -> Pages`.
2. Set:
   - Source: `GitHub Actions`
3. If repository or organization Actions policy is restricted, allow:
   - `actions/configure-pages`
   - `actions/upload-pages-artifact`
   - `actions/deploy-pages`

## Common failure troubleshooting

1. Permission error while publishing
   - Confirm GitHub Pages source is set to `GitHub Actions`.
   - Confirm workflow permissions include `pages: write` and `id-token: write`.

2. `_next` assets return `404`
   - Keep root-path static export setup (`trailingSlash: true`, no `basePath` for current setup).
   - If hosting topology changes, update Next config and deployment docs together.

3. Dynamic route path opens `404`
   - Static export only includes pre-generated params from `generateStaticParams()`.
   - Add missing slug/id to generation input, then rebuild and redeploy.

4. Route loads locally but refresh on static host returns `404`
   - Keep `trailingSlash: true` so exported routes map to folder `index.html` paths.

5. CI fails at install stage
   - Re-run workflow to rule out transient npm/network issue.
   - If persistent, inspect lockfile/dependency drift and ensure Node 20 compatibility.
