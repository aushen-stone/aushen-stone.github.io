# Next Steps - Aushen Web

Last updated: 2026-04-28

## Release Goal
Launch `aushenstone.com.au` on the current static Next.js stack while protecting lead capture and minimizing SEO loss during WordPress cutover.

## Status Model
- Allowed status values: `Open`, `Blocked`, `In Progress`, `Done`.
- Every active item must include: `Owner`, `Evidence`, `Exit Criteria`.
- Active tracking must use stable anchors (`file + semantic anchor`), not line numbers.

## P0 Launch Blockers

### LAUNCH-P0-001 - Contact form delivery must work end-to-end
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - `/contact` submits JSON to `NEXT_PUBLIC_CONTACT_API_URL`.
  - Submit lifecycle is visible (`Sending`, success, error) with honeypot field.
- Evidence:
  - Runtime wiring exists in `src/app/contact/ContactPageClient.tsx`.
  - Build-time variable validation exists in `.github/workflows/deploy.yml`.
- Exit Criteria:
  - Production endpoint receives real submit payloads.
  - Success and failure UX verified on production domain.
  - Owner-confirmed delivery target (Worker/Resend or equivalent) documented.

### LAUNCH-P0-002 - Legacy WordPress URL migration with 301 redirects
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - High-priority legacy URLs must 301 to mapped new routes.
- Evidence:
  - No redirect execution layer is tracked as implemented in repo runtime.
- Exit Criteria:
  - Redirect map approved and owned.
  - Representative high-priority legacy URLs return `301` to correct destination.
  - Redirect execution method documented (Cloudflare/legacy host/equivalent).

### LAUNCH-P0-003 - SEO crawl/index baseline verification
- Status: `In Progress`
- Owner: `TBD`
- Scope:
  - Confirm launch indexing policy and sitemap/robots accessibility on production domain.
- Evidence:
  - Metadata/canonical utilities: `src/lib/seo.ts`.
  - Metadata routes: `src/app/robots.ts`, `src/app/sitemap.ts`.
  - Route-level metadata wrappers exist for release routes and dynamic product/project detail routes.
- Exit Criteria:
  - Production `robots.txt` and `sitemap.xml` are accessible and correct.
  - `index` vs `noindex` behavior is validated for `/cart` and `/projects/[id]`.
  - Search Console inspection and sitemap submission completed.

### LAUNCH-P0-004 - GA4 + Search Console launch telemetry validation
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - Verify production pageview and `form_submit` observability.
- Evidence:
  - Telemetry validation remains unverified in active execution docs.
- Exit Criteria:
  - GA4 receives production pageview + `form_submit` events.
  - Search Console property is verified and sitemap submitted.
  - Monitoring owner and post-cutover check window are documented.

### LAUNCH-P0-005 - Domain cutover and rollback runbook
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - Define cutover runbook, trigger thresholds, and rollback path.
- Evidence:
  - Operational runbook validation is not recorded as complete.
- Exit Criteria:
  - Cutover steps and rollback steps are documented with owners.
  - Dry-run or tabletop execution is recorded.
  - Rollback trigger thresholds are explicit.

## P1 Active Quality / Risk Items

### P1-DATA-LINK-001 - Project detail product links can route to non-generated product paths
- Status: `Open`
- Owner: `TBD`
- Scope:
  - `src/app/projects/[id]/ProjectDetailClient.tsx` uses `project.products[].slug` links to `/products/{slug}`.
  - Product routes are statically generated from `PRODUCTS` in `src/app/products/[slug]/page.tsx`.
- Evidence:
  - Project detail “Get The Look” uses hard-coded product slugs not guaranteed to exist in generated product set.
  - Product dynamic route uses `dynamicParams = false` and `generateStaticParams()` from `PRODUCTS`.
- Exit Criteria:
  - Every project product slug resolves to generated product routes, OR
  - A documented fallback/degrade strategy is implemented and validated.
  - Regression check is added to prevent future slug drift.

### P1-IMG-001 - Replace remaining non-project/non-product placeholder visuals
- Status: `Open`
- Owner: `TBD`
- Scope:
  - In-scope surfaces: `/`, `/services`, `/about`, `/contact` and shared components used by those routes.
  - Remaining placeholder anchors:
    - `src/app/components/Navbar.tsx` -> mega-menu featured card (`New Arrival / Italian Porphyry`).
    - `src/app/components/ServicesSection.tsx` -> first service card image (`Templating Service`).
- Evidence:
  - Both anchors still use `images.unsplash.com` sources.
- Exit Criteria:
  - In-scope routes/components no longer depend on obvious placeholder imagery.
  - Asset source and ownership are documented for each replaced anchor.

### P1-CONTACT-INFO-001 - Complete contact-critical destination ownership
- Status: `Blocked`
- Owner: `Business Owner (TBD)`
- Scope:
  - Finalize real social profile URLs and legal policy destinations.
- Evidence:
  - Footer social icons currently point to platform homepages.
  - Published terms page now exists at `/terms-condition/` and Footer links to it.
  - Published privacy policy now exists at `/privacy-policy/` and Footer links to it.
- Exit Criteria:
  - Social links resolve to business-owned profiles.
  - Privacy policy and terms resolve to published destinations. (Legal destinations complete as of 2026-04-28.)
  - Final URLs are verified on Footer and Contact surfaces.

### P1-LINT-IMG-001 - Resolve image optimization warning backlog
- Status: `Open`
- Owner: `Engineering`
- Scope:
  - Current lint health is `0 errors, 23 warnings` (`@next/next/no-img-element`).
- Evidence:
  - Warnings are present across shared components and route clients.
- Exit Criteria:
  - Warnings are removed, OR
  - Remaining warnings are intentionally documented with rationale and owner.

### P1-RWD-QA-001 - Consolidate responsive QA evidence
- Status: `In Progress`
- Owner: `Engineering`
- Scope:
  - Validate release routes for `320/360/390/768/1024` and low-height (`<=430px`) behavior.
- Evidence:
  - Code-side squeeze mitigations are in place; evidence and automation remain partial.
- Exit Criteria:
  - No critical nav/overlay/horizontal-overflow regressions in target viewport matrix.
  - Evidence links are attached for checkpoint routes.

## P2 Backlog (Not Launch-Blocking)
- `ADM-LITE-001` lightweight admin portal remains backlog only.
- `P2-DATA-BLUEOCEAN-001` reclassify remaining Blueocean special finishes (`Polished`, `Rockface`, `Ripple`, and other non-honed carryovers) out of the continuity slug once the business grouping is confirmed.
- `P2-ACCESSORIES-MAPEI-001` evaluate `Mapei` as a later accessories expansion after Phase 1 coverage is stable.
- Project detail content typing/CMS migration remains backlog.
- Full e2e suite expansion remains backlog.

## Canonical Contracts (Docs Layer)

### Canonical Domain Contract
- Canonical domain for metadata/robots/sitemap is `https://aushenstone.com.au/`.
- Source of truth: `src/lib/seo.ts` (`SITE_URL`).
- GitHub Pages is a publish channel, not canonical domain authority.

### Project Product Link Contract
- In `src/app/projects/[id]/ProjectDetailClient.tsx`, `project.products[].slug` must map to generated product routes from `PRODUCTS`.
- If not guaranteed, project detail must provide a documented fallback behavior.

### Task Tracker Contract
- Active work tracking must use stable anchors (file + semantic marker), not line numbers.
- Active items must include `Owner`, `Evidence`, `Exit Criteria`.

### Blueocean Split Contract
- `blueocean` remains the phase-1 continuity slug and must stay routable.
- `blueocean-honed` is a dedicated generated product route sourced from `Blueocean Honed` rows in the outer CSV.
- Public display names are applied through `ProductOverride.displayName`: `blueocean` -> `BlueOcean Sawn`; `blueocean-honed` -> `BlueOcean Honed`.
- Remaining Blueocean special finishes are intentionally still grouped under `blueocean` until `P2-DATA-BLUEOCEAN-001` is executed.

## Verification Commands
```bash
npm ci
npm run lint
npm run build
npx tsc --noEmit
npm run build:pages
```

## Acceptance Scenarios (Docs Governance)
1. Active docs have no line-number-based tracking.
2. Active docs use only `Open/Blocked/In Progress/Done` statuses.
3. Domain narrative is consistent: canonical domain is `aushenstone.com.au`.
4. `NEXT_STEPS` contains only active execution items and acceptance contracts.
5. `P1-DATA-LINK-001` includes owner/evidence/exit criteria and is visible in active board.
6. Active docs and architecture facts do not conflict with current code behavior.

## Assumptions and Defaults
1. Documentation remains English-first.
2. Runtime changes are allowed when they are required to close active launch or contact-critical items.
3. Missing business inputs are tracked as `Blocked` with `Owner: TBD`.
4. WordPress cutover still requires an external redirect execution layer.
