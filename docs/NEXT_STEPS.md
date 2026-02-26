# Next Steps - Aushen Web

Last updated: 2026-02-26

## Current Release Goal
Launch `aushenstone.com.au` quickly on the current Next.js static site while protecting lead capture and minimizing SEO loss during WordPress -> GitHub Pages cutover.

## P0 (Launch Cutover Blockers)

### Open P0 blockers
- `LAUNCH-P0-001` - Contact form delivery must work end-to-end.
  - status update (2026-02-26): `/contact` now submits JSON to `NEXT_PUBLIC_CONTACT_API_URL` with submit-state feedback and honeypot field.
  - current risk: production endpoint/config validation is still pending (Worker/Resend + environment wiring + live submit verification).
  - required before cutover: successful submit path (email/API/form backend) with user feedback and error handling.
- `LAUNCH-P0-002` - Legacy URL migration with 301 redirects.
  - current risk: old WordPress URLs will 404 after domain switch without redirect mapping.
  - required before cutover: prioritized old->new redirect map (at minimum high-traffic and high-ranking legacy URLs).
- `LAUNCH-P0-003` - SEO crawl/index baseline for new stack.
  - status update (2026-02-26): route-level title/description/canonical is now wired for key routes; generated `robots.txt` and `sitemap.xml` are now emitted in static export.
  - current risk: production-domain verification is still pending (GSC inspection + sitemap submission + crawl/index checks).
  - required before cutover: verify production `robots.txt` and `sitemap.xml` accessibility, and confirm indexing behavior for `index` routes vs `noindex` routes (`/cart`, `/projects/[id]`).
- `LAUNCH-P0-004` - Launch telemetry for conversion and SEO monitoring.
  - current risk: no validated analytics/search-console launch instrumentation for post-cutover diagnostics.
  - required before cutover: GA4 page view + `form_submit` event checks, Search Console property/sitemap submission.
- `LAUNCH-P0-005` - Domain cutover and rollback runbook.
  - current risk: DNS switch without rollback procedure increases outage/revenue risk.
  - required before cutover: documented cutover steps, owner, rollback trigger thresholds, and fast rollback path.

### Overlap map (deduplicated tracking)
- `LAUNCH-P0-001` overlaps existing CTA work in `P1 -> 1) Stabilize primary CTA behavior for production`.
  - rule: track `/contact` submit implementation under `LAUNCH-P0-001` only (do not track this specific item as P1 debt).
- `LAUNCH-P0-003` overlaps metadata quality concerns implied by generic SEO defaults.
  - rule: route-level SEO baseline for launch is P0; rich schema and deeper SEO enhancements stay in P1/P2.
- `LAUNCH-P0-005` depends on static export baseline already documented in `P1 -> 0) Harden GitHub Pages deployment baseline`.
  - rule: keep export/CI hardening in P1; domain cutover operational readiness is P0.

### Historical feature P0 items (closed 2026-02-06)
- `UI-NAV-001` closed:
  - navbar layout refactored to a reserved center-logo grid structure.
  - desktop nav visibility now follows a three-tier layout:
    - `<1024`: mobile menu
    - `1024-1535`: deterministic two-row desktop nav split (`2+2`)
    - `>=1536`: single-row desktop nav
  - overlap at common desktop widths is resolved without relying on natural `flex-wrap` fallback.
- `CART-SAMPLE-001` closed:
  - sample-cart flow implemented end-to-end:
    - product detail add sample
    - navbar trolley live count
    - right-side sample drawer
    - dedicated `/cart` page
    - `/contact?source=sample-cart` message prefill handoff

## Sample Cart v1 (Implemented Contract)
- Business mode: sample cart only (no payment, pricing, stock, checkout).
- Entry point: only product detail page can add samples (`src/app/products/[slug]/ProductDetailClient.tsx`).
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
  - prefill template uses polite request copy with numbered sample lines and follow-up placeholders.
  - prefill content persists across refresh and is cleared only after successful contact submit.
- Explicitly out of scope for v1:
  - direct add from `/products` list page.
  - any payment/checkout flow.

## P1

### Product UI Density Refresh (Implemented 2026-02-10)
- Delivered:
  - `/products` now uses compact discovery layout (`search + material/application filters` + fixed-density grid).
  - `/products/[slug]` now uses information-first detail layout with dropdown selectors and chained resets.
  - `View Mode` is now low-priority (footer-adjacent) and affects audience notes copy only.
  - CTA stack is fixed homeowner-priority; sample-cart flow contract is unchanged.
  - `Technical Specifications` remains post-primary in the secondary technical card.
- Validation:
  - `npm run lint`: pass (`0 errors, 20 warnings`)
  - `npm run build`: pass

### Product Photo Population Phase 1 (Implemented 2026-02-20)
- Delivered:
  - mapped product images are now prepared and served as web assets:
    - source audit: `docs/photo_audit_2026-02-17/photo_audit_all_in_one.csv` (`status=mapped` only)
    - generated assets: `public/product-photos/*.webp`
    - generated mapping source: `src/data/product_images.generated.ts`
    - publish validation summary: `docs/photo_audit_2026-02-17/summary_after_publish.txt`
  - image-prep automation added:
    - `scripts/prepare-product-photos.py`
    - quality profile: `max-side=1600`, `quality=80` (WEBP)
    - deterministic multi-image ordering and `{slug}-{index}.webp` output naming
  - product UI image behavior updated:
    - `/products` uses cover fallback chain:
      - `imageUrls[0]` -> `imageUrl` -> `/Application001.webp`
    - `/products/[slug]` supports detail-only multi-image carousel (arrow + dot controls, no autoplay)
  - override/type contract update:
    - `ProductOverride.imageUrls?: string[]` introduced
    - generated image overrides are merged with manual overrides in `src/data/product_overrides.ts`
- Snapshot:
  - mapped rows published: `63`
  - product slugs with mapped images: `54`
  - source-file misses during prep: `0`
  - unresolved missing-image products (still placeholder): `8`

### 0) Harden GitHub Pages deployment baseline
- Problem:
  - deployment now depends on static export contract (`output: "export"` + pre-generated dynamic route params).
  - CI install currently requires peer resolution fallback because `@studio-freight/react-lenis@0.0.47` does not declare React 19 peer support.
- Implemented now:
  - Next static export config in `next.config.ts` (`output`, `trailingSlash`, `images.unoptimized`).
  - route wrappers + param generation:
    - `src/app/products/[slug]/page.tsx` + `src/app/products/[slug]/ProductDetailClient.tsx`
    - `src/app/projects/[id]/page.tsx` + `src/app/projects/[id]/ProjectDetailClient.tsx`
  - Pages deployment workflow:
    - `.github/workflows/deploy.yml` (`push main` + `workflow_dispatch`, publish `dist` to `gh-pages`).
  - install compatibility fallback:
    - `.npmrc` (`legacy-peer-deps=true`)
    - workflow install step uses `npm ci --legacy-peer-deps`.
- Action:
  - replace or upgrade smooth-scroll dependency to React 19-compatible package/version.
  - remove `legacy-peer-deps` fallback after compatibility is resolved.
  - keep static route parameter sources explicit and version-controlled.
- Definition of Done:
  - `npm ci` passes without `legacy-peer-deps` in both local and CI.
  - Pages workflow stays green for 3 consecutive pushes.
  - dynamic route generation source is documented and tested.

### 1) Stabilize primary CTA behavior for production
- Problem: several primary CTAs are visual-only.
- Current unimplemented CTA inventory:
  - `src/app/components/Hero.tsx` (`Make Appointments`)
  - `src/app/components/CreativeHubSection.tsx` (`Book A Consultation`, `Book The Space`)
  - `src/app/services/page.tsx` (`Book a Consultation`, `Contact Us`, `Visit Showroom`)
  - `src/app/products/[slug]/ProductDetailClient.tsx` (`Enquire`, `Book Consultation`, `Call Us`)
  - `src/app/components/Footer.tsx` (newsletter submit)
- Overlap note:
  - `/contact` "Send Message" submit is elevated to `LAUNCH-P0-001` and should be tracked there, not as non-blocking P1 debt.
- Implemented CTA baseline (already operational):
  - `src/app/products/[slug]/ProductDetailClient.tsx` (`Order Free Sample`) adds sample lines and opens the sample-cart drawer.
  - `src/app/components/Navbar.tsx` trolley count + drawer open/close interaction.
- Action: each primary CTA must either navigate, submit, or be explicitly disabled with clear copy.
- Definition of Done: no ambiguous primary CTA states remain.

### 2) Reduce remaining lint warnings (image optimization)
- Problem: `eslint` has `0 errors` but `20 warnings` (`@next/next/no-img-element`).
- Action: migrate high-impact visual assets from `<img>` to `next/image`, then configure image host policy in `next.config.ts`.
- Definition of Done: warnings are cleared or explicitly documented with rationale.

### 3) Task A - Clear placeholder visuals on non-Project/Product surfaces
- Problem:
  - multiple non-project/non-product routes still rely on obvious placeholders (mainly Unsplash sources and explicit placeholder map visual).
- Scope:
  - include: `/`, `/services`, `/about`, `/contact` and shared components rendered on these routes.
  - exclude: `/projects`, `/projects/[id]`, `/products`, `/products/[slug]`.
- Current placeholder inventory (inputs):
  - `src/app/services/page.tsx` (line-level image slots around `15`, `22`, `29`, `201`)
  - `src/app/about/page.tsx` (line-level image slots around `49`, `93`, `100`, `107`)
  - `src/app/contact/page.tsx` (placeholder map block around `145`, `147`)
  - `src/app/components/Navbar.tsx` (mega-menu feature image around `443`)
  - `src/app/components/ServicesSection.tsx` (service image around `13`)
- Action:
  - build and maintain a replacement tracker per image slot (`source file + slot + target asset + status`).
  - track status using `Replaced / Waiting for Asset / Blocked`.
  - keep unresolved slots visible in docs until closed.
- Current progress (2026-02-25):
  - Replaced `9` in-scope slots with local assets under `public/task-a-2026-02-24/`:
    - `src/app/services/page.tsx` (`15`, `22`, `29`, `201`)
    - `src/app/about/page.tsx` (`49`, `93`, `100`, `107`)
    - `src/app/contact/page.tsx` (`147`)
  - Remaining placeholder slots (`5`, intentionally deferred in that round):
    - `src/app/components/Navbar.tsx` (`443`)
    - `src/app/components/BestSellers.tsx` (`15`, `21`, `27`)
    - `src/app/components/ServicesSection.tsx` (`13`)
  - Temporary policy for this round: provided source images are published as-is (including visible watermark marks) and queued for a later clean-asset pass.
- Status update (2026-02-26):
  - `src/app/components/BestSellers.tsx` no longer uses placeholder/Unsplash cards.
  - homepage best-seller cards are now wired to real catalog products with mapped product imagery and detail-page links.
  - pinned homepage selection in this pass:
    - `blueocean` (Blue Ocean)
    - `grey-apricot` (Grey Apricot)
    - `silver-ash` (Silver Ash)
  - Remaining placeholder slots now: `2`
    - `src/app/components/Navbar.tsx` (`443`)
    - `src/app/components/ServicesSection.tsx` (`13`)
- Definition of Done:
  - in-scope routes/components no longer depend on obvious placeholder imagery (`images.unsplash.com` or explicit placeholder markers).
  - tracker status is fully up to date for all in-scope slots.

### 4) Task B - Unify contact-critical information (address/phone/email/hours/map/social)
- Problem:
  - contact-critical values were inconsistent across Footer and Contact sections; core fields are now unified.
  - social links and legal-policy destinations still lack business-owned final targets.
- Scope:
  - fields: address, phone, email, business hours, map link, social profile links.
  - coverage: all in-scope route/component surfaces where these values appear.
- Current inconsistency inventory (inputs):
  - Resolved (2026-02-25):
    - unified contact-critical values across Footer + Contact:
      - address: `16a/347 Bay Rd, Cheltenham VIC 3192`
      - phone: `0430 799 906`
      - email: `info@aushenstone.com.au`
      - business hours: `Mon-Fri 8:30am-4:30pm`, `Sat 10:00am-3:00pm`, `Sun Closed`
    - actionable contact links landed across Contact + Footer:
      - address links use Google Maps directions URL
      - phone links use `tel:+61430799906`
      - email links use `mailto:info@aushenstone.com.au`
    - map link/map visual and careers mailto aligned to the same contact source:
      - `src/app/contact/page.tsx` (`110`, `146`)
      - `src/app/components/Footer.tsx` (`77`)
  - Remaining (owner input required):
    - social links currently pointing to platform homepages:
      - `src/app/components/Footer.tsx` (`130`, `131`, `132`, `133`)
    - legal policy pages still shown as request-only placeholders:
      - `src/app/components/Footer.tsx` (`84`, `87`)
- Action:
  - maintain the unified source-of-truth values now landed in Footer + Contact.
  - collect business-owned social profile URLs and replace platform-homepage placeholders.
  - collect final privacy-policy and terms destinations, then replace request-only placeholders.
- Definition of Done:
  - address/phone/email/hours are consistent and verified across all in-scope surfaces.
  - map and social links resolve to real business destinations.
  - privacy-policy and terms links resolve to published destinations.
  - any unresolved value is explicitly documented with blocker owner/status.

### 5) Consolidate responsive QA baseline
- Problem: route-level squeeze fixes are now broadly landed, but visual evidence and automated regression coverage are still incomplete.
- Implemented now:
  - responsive baseline variables + low-height rule (`max-height: 430px`) in `src/app/globals.css`
  - navbar squeeze hardening in `src/app/components/Navbar.tsx`
  - route updates in:
    - `src/app/components/Hero.tsx`
    - `src/app/components/ProjectShowcase.tsx`
    - `src/app/components/ProductSidebar.tsx`
    - `src/app/products/page.tsx`
    - `src/app/products/[slug]/ProductDetailClient.tsx`
    - `src/app/services/page.tsx`
    - `src/app/contact/page.tsx`
    - `src/app/about/page.tsx`
    - `src/app/projects/page.tsx`
    - `src/app/projects/[id]/ProjectDetailClient.tsx`
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

### 6) Add Playwright responsive smoke regression (deferred to next cycle)
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
  - `src/app/projects/[id]/ProjectDetailClient.tsx`
- Action: move project detail content into typed data module or CMS source.
- Definition of Done: content updates do not require editing route component logic.

### 2) Add automated UI regression coverage
- Problem: mobile nav, product filter drawer, and dynamic route behavior rely on manual checks.
- Files:
  - `src/app/components/Navbar.tsx`
  - `src/app/products/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/projects/[id]/ProjectDetailClient.tsx`
- Action: add e2e coverage (Playwright or equivalent) for menu/drawer flow, routing, and key CTA paths.
- Definition of Done: CI catches regressions for open/close behavior, focus flow, and route-driven rendering.

### 3) Add e2e coverage for Sample Cart v1
- Problem: sample-cart behavior is high-risk and stateful.
- Action: add e2e checks for add/merge/limit/persist/handoff flow.
- Definition of Done: CI validates core sample-cart scenarios listed below.

### 4) ADM-LITE-001 - Lightweight Admin Portal (Improvement)
- Problem:
  - store staff cannot safely update display content without engineering support.
  - current workflow requires code edits + deployment even for routine copy/image/tone updates.
- v1 objective:
  - provide a WordPress-style lightweight admin experience while keeping release control through GitHub PR flow.
- Planned scope (v1):
  - admin entry: `/admin` + `/admin/login`.
  - authentication: single in-house username/password account.
  - editable fields only:
    - tone tags
    - product description
    - image URL
    - homeowner/professional summaries and bullet notes
    - CTA copy override text
  - product structural data (`material/finish/application/size`) remains in CSV pipeline for this phase.
  - editable data source planned as JSON:
    - `src/data/product_overrides.editable.json`
  - publish behavior:
    - save action opens GitHub PR flow (branch + commit + PR).
    - no direct write to `main`.
- Definition of Done:
  - store users can log in, edit display fields, submit a PR, and production reflects changes after merge.
  - rollback remains available through standard GitHub revert workflow.

## Public APIs / Interfaces / Types (Target Contract; Docs-Only)

### Route Contract
- `GET /cart`
  - sample-cart overview/edit page.
- `GET /contact`
  - supports cart-origin prefill for message content (sample line summary).

### Client Storage Contract
- Storage key: `aushen_sample_cart_v1`
- Prefill handoff key: `aushen_sample_cart_contact_prefill_v1`
- Prefill-cleared marker key: `aushen_sample_cart_contact_prefill_cleared_v1`
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

### Planned Admin Interfaces (P2 Target; Docs-Only)

#### Planned Route Contract
- `GET /admin/login`
  - admin login screen.
- `GET /admin`
  - admin landing page (authenticated only).
- `GET /admin/products`
  - editable product display-field list.
- `GET /admin/products/:slug`
  - single-product display-field editor.

#### Planned Service Contract
- `POST /api/admin/login`
  - validates username/password and issues session cookie.
- `POST /api/admin/logout`
  - clears session cookie.
- `GET /api/admin/products`
  - returns editable display fields.
- `GET /api/admin/products/:slug`
  - returns editable fields for one product.
- `POST /api/admin/products/:slug/save-pr`
  - validates payload, creates branch/commit/PR on GitHub.
  - response includes:
    - `prUrl`
    - `branchName`
    - `commitSha`

#### Planned Type Contract
- `AdminEditableOverride`
- `AdminSavePrRequest`
- `AdminSavePrResponse`
- `AdminSessionUser`

#### Planned Compatibility Contract
- `src/data/product_overrides.ts` remains read-compatible during migration.
- manual editing target shifts to `src/data/product_overrides.editable.json` when implemented.

### Planned Security Baseline (Admin v1)
- password storage: bcrypt hash only (no plaintext).
- session cookie: HttpOnly + Secure + SameSite.
- CSRF token required for write endpoints.
- login rate limiting by account + source IP.
- temporary lockout after repeated failed login attempts.
- required env vars (target):
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD_HASH`
  - `ADMIN_SESSION_SECRET`
  - `GITHUB_TOKEN`
  - `GITHUB_REPO`
  - `GITHUB_OWNER`

### Planned Admin Data Flow / Failure Handling
- flow:
  - read editable JSON -> edit in admin UI -> server validation -> GitHub branch/commit/PR -> return PR link.
- merge behavior:
  - merged PR updates `main`, existing deploy pipeline publishes updated content.
- failure behavior:
  - GitHub API errors return actionable messages and retry-safe status.
- concurrency behavior:
  - save checks latest base SHA and returns conflict prompt if stale.

## Test Cases / Scenarios

### Launch Cutover P0 checks
1. Contact form submit on `/contact` reaches configured delivery target and user sees success/failure feedback.
2. Redirect map validation: representative high-priority legacy URLs return `301` and land on intended new destinations.
3. Export output contains crawl baseline files (`robots.txt`, `sitemap.xml`) and they are accessible on target domain.
4. Key routes (`/`, `/products`, `/products/[slug]`, `/projects`, `/services`, `/contact`, `/about`) have non-generic route-level title/description/canonical metadata.
5. GA4 receives page view and `form_submit` events from production; Search Console property is verified and sitemap is submitted.
6. DNS cutover runbook and rollback runbook are tested (dry-run acceptable) with owner and decision thresholds recorded.

### Functional and regression checks
1. Add same product + same finish twice on detail page: cart remains one line.
2. Add same product with different finishes: cart shows separate lines.
3. Add over limit (`>10` lines): addition is blocked with user-facing feedback.
4. Refresh page: cart contents persist (`localStorage`).
5. Click trolley: drawer opens; drawer can navigate to `/cart`.
6. Click `Ask for sample` in cart: navigates to `/contact` with message prefilled.
7. `/products` list page has no direct sample add entry.
8. Navbar has no logo/menu overlap at threshold widths (including `1024`, `1366`, `1440`, `1536`, and `1680`).
9. Release routes (`/`, `/products`, `/products/[slug]`, `/services`, `/contact`, `/about`, `/projects`, `/projects/[id]`, `/cart`) show no squeeze at 320/360/390/768/1024 and no low-height overlap at `height <= 430px`.
10. `build -> tsc -> lint` command sequence reproduces expected health state.
11. `build:pages` creates `dist` with valid root entry and `_next` assets.
12. unknown dynamic paths under `/products/*` and `/projects/*` return static 404 (non-generated params).
13. Admin login accepts valid credentials and rejects invalid credentials.
14. Repeated failed login attempts trigger temporary lockout.
15. Unauthenticated access to `/admin` and admin write APIs is denied.
16. Admin can edit one product's display fields and submit `save-pr`.
17. `save-pr` response includes `prUrl`, `branchName`, and `commitSha`.
18. Merged content PR updates production display fields.
19. GitHub conflict on stale base SHA returns refresh/retry instruction.
20. Rollback path works via GitHub revert PR.
21. In-scope non-project/non-product routes/components (`/`, `/services`, `/about`, `/contact`) do not reference obvious placeholder imagery (`images.unsplash.com` or explicit placeholder markers).
22. Contact-critical values (address/phone/email/hours/map/social) are consistent between Footer and Contact surfaces and resolve to real business destinations.
23. For `source=sample-cart`, message prefill uses polite request template and correct numbered sample list.
24. Contact page refresh keeps sample-cart prefill intact before successful submit.
25. Manual edits to message are never overwritten by fallback prefill logic.
26. After successful submit from `source=sample-cart`, prefill storage is cleared and stale prefill does not reappear by direct reload.

## Assumptions and Defaults
1. No payment, pricing, inventory, or order lifecycle in current phase.
2. Sample request is the only cart business objective in v1.
3. Responsive issue tracking uses static audit first, then screenshot confirmation.
4. Responsive squeeze mitigation is implemented for core and secondary release routes; remaining work is evidence collection and automation.
5. Admin portal is an improvement backlog item (P2), not a current release blocker.
6. Admin v1 targets low-frequency updates with a single maintained account.
7. Audit-log persistence is out of scope for admin v1.
8. Product structure source-of-truth remains CSV + generation pipeline in admin v1.
9. Deployment target is root-path GitHub Pages (`aushen-stone.github.io`) unless explicitly reconfigured.
10. Current CI compatibility uses `legacy-peer-deps` as a temporary workaround.
11. Placeholder-visual cleanup scope in this cycle excludes `/projects`, `/projects/[id]`, `/products`, and `/products/[slug]`.
12. Contact-critical information scope in this cycle is limited to address/phone/email/hours/map/social (CTA semantics are out of scope here).
13. For WordPress -> new-site cutover, a redirect execution layer is required (Cloudflare rules, legacy host rules, or equivalent) before switching primary domain.

## Exit Criteria
- Launch P0 blockers (`LAUNCH-P0-001`..`LAUNCH-P0-005`) are closed with evidence.
- Historical feature P0 blockers (`UI-NAV-001`, `CART-SAMPLE-001`) remain closed.
- Contact form submit reaches business-owned destination reliably in production.
- Legacy high-priority URL set has validated 301 redirects to mapped new routes.
- `robots.txt` and `sitemap.xml` are generated and served on the production domain.
- GA4 + Search Console launch instrumentation is validated.
- Primary CTAs are actionable, or explicitly marked unavailable with clear copy.
- In-scope non-project/non-product routes/components (`/`, `/services`, `/about`, `/contact`) no longer depend on obvious placeholder imagery.
- Contact-critical values are unified across display surfaces (Footer/Contact), and map/social links point to real destinations.
- `npm run build` passes.
- `npx tsc --noEmit` passes after build (required for `.next/types` presence).
- `npm run lint` reports no errors (warnings are tracked until resolved).
- `npm run build:pages` produces `dist` for publish.
- GitHub Pages deploy workflow publishes `dist` to `gh-pages` on `main` push.
- Mobile/tablet widths (320/360/390/768/1024) and low-height landscape (`height <= 430px`) show no critical nav/overlay regressions on release routes.

## Verification Commands
```bash
npm ci --legacy-peer-deps
npm run build
npx tsc --noEmit
npm run lint
npm run build:pages
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
