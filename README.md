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

`build:pages` performs a static export and copies `out/` to `dist/` for GitHub Pages deployment.

## GitHub Pages deployment

This repository is configured for **root-path Pages hosting** on `aushen-stone.github.io`.

- Expected site URL: `https://aushen-stone.github.io/`
- No `basePath` is configured because this is a user/organization Pages repository (root path deployment).
- Deployment uses `secrets.GITHUB_TOKEN` only (no personal access token).

### Workflow

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
   - For this repository (`aushen-stone.github.io`), keep root-path setup (no `basePath`).
   - If moved to a project repository (for example `user/repo`), update Next config to use the repo path prefix (`basePath` and usually `assetPrefix`).

3. Dynamic route path opens `404`
   - Static export only includes pre-generated params from `generateStaticParams()`.
   - Add the missing slug/id to generation input, then rebuild and redeploy.

4. Route loads locally but refresh on Pages returns `404`
   - Keep `trailingSlash: true` so exported routes map to folder `index.html` paths on static hosting.

5. CI fails at install stage
   - Re-run workflow to rule out transient npm/network issue.
   - If persistent, inspect lockfile/dependency drift and ensure Node 20 compatibility.
