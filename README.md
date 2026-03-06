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
npm run build
npm run lint
npm run build:pages
```

`build:pages` performs a static export and copies `out/` to `dist/` for GitHub Pages publishing.

## Canonical domain and hosting model

- Canonical public domain: `https://aushenstone.com.au/`.
- Canonical metadata/sitemap source in code: `src/lib/seo.ts` (`SITE_URL`).
- GitHub Pages is the publish channel (`dist` -> `gh-pages`), not the canonical domain contract.

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

## GitHub Pages deployment channel

Deployment workflow file:

- `.github/workflows/deploy.yml`

Triggers:

- push to `main`
- manual run via `workflow_dispatch`

Workflow steps:

1. `npm ci`
2. `npm run lint`
3. `npm run build:pages`
4. Publish `dist/` to `gh-pages` using `peaceiris/actions-gh-pages@v4`

## Required repository settings (manual)

1. Go to `Settings -> Actions -> General -> Workflow permissions` and set to `Read and write permissions`.
2. Go to `Settings -> Pages` and set:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/(root)`

## Common failure troubleshooting

1. Permission error while publishing (`403` or push denied)
   - Confirm `permissions: contents: write` exists in workflow.
   - Confirm repository Actions permission is `Read and write`.

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
