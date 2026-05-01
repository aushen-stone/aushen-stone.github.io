# Next Steps - Aushen Web

Last updated: 2026-05-01

## Release Goal
Launch `aushenstone.com.au` on the current static Next.js stack while protecting lead capture and minimizing SEO loss during WordPress cutover.

## Status Model
- Allowed status values: `Open`, `Blocked`, `In Progress`, `Done`.
- Every active item must include: `Owner`, `Evidence`, `Exit Criteria`, and `Docs Impact`.
- Active items may include `Tags`; every marketing-originated item must include `marketing`.
- Active tracking must use stable anchors (`file + semantic anchor`), not line numbers.
- `Docs Impact` names the docs that must change when the item lands; use `None` only when no documentation change is required and state that in the final handoff.

## P0 Launch Blockers

### LAUNCH-P0-001 - Contact form delivery must work end-to-end
- Status: `Done`
- Owner: `Business Owner / Engineering`
- Scope:
  - `/contact` submits JSON to `NEXT_PUBLIC_CONTACT_API_URL`.
  - Submit lifecycle is visible (`Sending`, success, error) with honeypot field.
- Evidence:
  - Runtime wiring exists in `src/app/contact/ContactPageClient.tsx`.
  - Build-time variable validation exists in `.github/workflows/deploy.yml`.
  - GitHub Actions repository variable `NEXT_PUBLIC_CONTACT_API_URL` is configured.
  - Production delivery has been owner-checked as working.
  - Production delivery target is Cloudflare Worker + Resend.
- Docs Impact: `ARCHITECTURE / README_AGENT / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Production endpoint receives real submit payloads. Completed by owner verification.
  - Success and failure UX verified on production domain. Completed by owner verification.
  - Owner-confirmed delivery target documented: Cloudflare Worker + Resend.

### LAUNCH-P0-002 - Legacy WordPress URL migration with 301 redirects
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - High-priority legacy URLs must 301 to mapped new routes.
- Evidence:
  - No redirect execution layer is tracked as implemented in repo runtime.
- Docs Impact: `ARCHITECTURE / NEXT_STEPS / WORKLOG`
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
- Docs Impact: `ARCHITECTURE / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Production `robots.txt` and `sitemap.xml` are accessible and correct.
  - `index` vs `noindex` behavior is validated for `/cart` and `/projects/[id]`.
  - Search Console inspection and sitemap submission completed.

### LAUNCH-P0-004 - GA4 + Search Console launch telemetry validation
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - Verify production pageview and `contact_form_submit` observability.
- Evidence:
  - Telemetry validation remains unverified in active execution docs.
- Docs Impact: `README_AGENT / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - GA4 receives production pageview + `contact_form_submit` events.
  - Search Console property is verified and sitemap submitted.
  - Monitoring owner and post-cutover check window are documented.

### LAUNCH-P0-005 - Domain cutover and rollback runbook
- Status: `Blocked`
- Owner: `TBD`
- Scope:
  - Define cutover runbook, trigger thresholds, and rollback path.
- Evidence:
  - Operational runbook validation is not recorded as complete.
- Docs Impact: `README_AGENT / NEXT_STEPS / WORKLOG`
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
- Docs Impact: `ARCHITECTURE / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Every project product slug resolves to generated product routes, OR
  - A documented fallback/degrade strategy is implemented and validated.
  - Regression check is added to prevent future slug drift.

### P1-PROJECT-AUTH-001 - Project showcase content must be real or explicitly de-indexed
- Status: `Open`
- Owner: `Business Owner / Engineering`
- Scope:
  - `/projects` is indexable and included in sitemap, but the listing currently uses hard-coded mock project records and Unsplash images.
  - `/projects/[id]` is `noindex,follow`, but users can navigate into detail pages from the indexable listing.
  - Project detail “Get The Look” product slugs are separately tracked in `P1-DATA-LINK-001`.
- Evidence:
  - Project listing content lives in `src/app/projects/ProjectsPageClient.tsx`.
  - Project detail content lives in `src/app/projects/[id]/ProjectDetailClient.tsx`.
  - `/projects` is listed in `src/app/sitemap.ts`; `/projects/[id]` pages are route-level `noindex`.
- Docs Impact: `ARCHITECTURE / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Project showcase content and imagery are business-approved and real, OR `/projects` is temporarily removed from sitemap/noindexed until approved.
  - Project detail navigation and product references do not send users to broken product routes.
  - Indexing decision is documented in `docs/ARCHITECTURE.md`.

### P1-IMG-001 - Replace remaining non-project/non-product placeholder visuals
- Status: `Open`
- Owner: `TBD`
- Scope:
  - In-scope surfaces: `/`, `/services`, `/about`, `/contact` and shared components used by those routes.
  - Remaining placeholder anchors:
    - `src/app/components/ServicesSection.tsx` -> first service card image (`Templating Service`).
- Evidence:
  - `src/app/components/ServicesSection.tsx` still uses an `images.unsplash.com` source for `Templating Service`.
  - The former Navbar `New Arrival / Italian Porphyry` placeholder has been replaced by the Accessories mega-menu card.
- Docs Impact: `NEXT_STEPS / WORKLOG`
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
- Docs Impact: `README_AGENT / NEXT_STEPS / WORKLOG`
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
- Docs Impact: `NEXT_STEPS / WORKLOG`
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
- Docs Impact: `README_AGENT / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - No critical nav/overlay/horizontal-overflow regressions in target viewport matrix.
  - Evidence links are attached for checkpoint routes.

## Marketing Action List

### MKT-P0-001 - Contact form conversion close loop
- Status: `Done`
- Owner: `Engineering / Marketing`
- Tags: `marketing`
- Scope:
  - Make successful contact submissions reliably trackable for paid media and GA4.
  - Submit success pushes a stable `contact_form_submit` event and routes to `/thank-you/`.
- Evidence:
  - `src/app/contact/ContactPageClient.tsx` pushes `contact_form_submit` to `window.dataLayer` after a successful API response.
  - `src/app/contact/ContactPageClient.tsx` routes successful submits to `/thank-you/`.
  - `src/app/thank-you/page.tsx` provides the noindex confirmation page.
- Docs Impact: `ARCHITECTURE / README_AGENT / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Successful form submit has a stable conversion signal usable by GA4/Google Ads.
  - `/thank-you/` success confirmation behavior is implemented.
  - Conversion event name for marketing handoff: `contact_form_submit`.
  - Production GA4/GTM verification remains tracked under `LAUNCH-P0-004`.

### MKT-P0-002 - Align Footer newsletter module with real behavior
- Status: `Open`
- Owner: `Business Owner / Engineering`
- Tags: `marketing`
- Scope:
  - Resolve the mismatch between the Footer “Stay Inspired” newsletter copy and the current submit behavior.
  - Choose either a real newsletter capture path or rewrite the module as a project enquiry/contact CTA.
- Evidence:
  - Footer copy and input live in `src/app/components/Footer.tsx`.
  - Current submit intent routes users to `/contact` rather than subscribing them.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Footer CTA text matches the actual action.
  - If newsletter capture is retained, the collection destination and owner are documented.
  - If rewritten as enquiry CTA, copy and button affordance are validated on desktop/mobile.

### MKT-P1-001 - Add trust signals near the Contact form
- Status: `Open`
- Owner: `Business Owner / Marketing / Engineering`
- Tags: `marketing`
- Scope:
  - Add credibility cues to the highest-intent contact surface.
  - Candidate signals: Google review rating/count, since 2003, Cheltenham showroom, 10% Rule, local project support, response reassurance.
- Evidence:
  - Advertising feedback flags `/contact` as lacking social proof at the point of enquiry.
  - Contact page implementation lives in `src/app/contact/ContactPageClient.tsx`.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Contact page includes verified trust signals adjacent to or near the enquiry form.
  - All numerical claims and review references are business-approved.
  - Mobile layout keeps form completion friction low.

### MKT-P1-002 - Add homepage social proof
- Status: `Open`
- Owner: `Business Owner / Marketing / Engineering`
- Tags: `marketing`
- Scope:
  - Add a restrained social-proof band to the homepage without weakening the premium visual direction.
  - Candidate content: Google review rating/count, operating since 2003, showroom/local service, project/customer count if verified.
- Evidence:
  - Advertising feedback flags the homepage as visually strong but missing third-party or measurable trust proof.
  - Homepage composition lives in `src/app/page.tsx` and shared homepage sections under `src/app/components/`.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Homepage includes verified trust proof that can be scanned quickly.
  - No unverified project counts, client logos, or review claims are introduced.
  - Section is visually consistent with the current homepage.

### MKT-P1-003 - Add closing CTA to About page
- Status: `Open`
- Owner: `Engineering / Marketing`
- Tags: `marketing`
- Scope:
  - Add a next-step CTA after the About page brand narrative.
  - Candidate actions: visit showroom, browse products, talk to Aushen, or start stone selection.
- Evidence:
  - Advertising feedback flags the About page as ending without a clear next action.
  - About implementation lives in `src/app/about/AboutPageClient.tsx`.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - About page ends with a clear conversion-oriented next step.
  - CTA copy connects naturally to the 20+ year / sourcing / quality narrative.
  - Links resolve to the intended destination and are verified on mobile.

### MKT-P1-004 - Rework homepage hero CTA copy and visibility
- Status: `Open`
- Owner: `Marketing / Engineering`
- Tags: `marketing`
- Scope:
  - Review the hero CTA wording and first-fold visibility.
  - Candidate copy: “Book a Showroom Visit”, “Talk to a Stone Specialist”, or “Start Your Stone Selection”.
- Evidence:
  - Current hero CTA text is `Make Appointments` in `src/app/components/Hero.tsx`.
  - Advertising feedback describes the CTA as high-commitment and not prominent enough in the first fold.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Hero CTA copy is business-approved and customer-natural.
  - CTA is visible and usable across common desktop/mobile first-fold viewports.
  - CTA destination supports lead capture or showroom booking intent.

### MKT-P2-001 - Write differentiated descriptions for core product pages
- Status: `Open`
- Owner: `Marketing / Content / Engineering`
- Tags: `marketing`
- Scope:
  - Replace generic `About the Stone` copy for priority paid-media products first.
  - Initial scope should be the 10-15 products marketing intends to advertise.
- Evidence:
  - Default product description lives in `src/data/product_overrides.ts`.
  - Advertising feedback flags repeated product descriptions as the largest product-page content issue.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Priority products have unique descriptions covering material character, tone/texture, applications, and selection considerations.
  - Copy is added through the override layer, not by editing generated product data.
  - SEO metadata and product detail display remain consistent.

### MKT-P2-002 - Write differentiated audience notes for core product pages
- Status: `Open`
- Owner: `Marketing / Content / Engineering`
- Tags: `marketing`
- Scope:
  - Replace generic homeowner/professional `Audience Notes` for priority products.
  - Notes should vary by product material, application, finish, and buyer type.
- Evidence:
  - Default audience summaries and notes live in `src/data/product_overrides.ts`.
  - Product detail renders `Audience Notes` in `src/app/products/[slug]/ProductDetailClient.tsx`.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Priority product notes are specific enough to distinguish pool coping, paving, wall cladding, driveway, crazy pave, and interior/exterior use cases.
  - Homeowner and professional modes each provide distinct value.
  - No continuity slugs or generated product records are changed.

### MKT-P2-003 - Add in-page product enquiry path
- Status: `Open`
- Owner: `Engineering / Marketing`
- Tags: `marketing`
- Scope:
  - Reduce product-detail enquiry friction by adding an in-page enquiry drawer, modal, or short embedded form.
  - Reuse current product contact prefill and contact API behavior where practical.
- Evidence:
  - Product detail CTAs currently route to `/contact?source=product-detail`.
  - Current handoff preserves product selection context but still leaves the product page.
- Docs Impact: `ARCHITECTURE / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Users can start an enquiry from product detail without losing product context.
  - Submitted enquiry includes product, application, finish, size, and page URL.
  - Conversion tracking remains compatible with `MKT-P0-001`.

### MKT-P2-004 - Expand imagery for priority product pages
- Status: `Open`
- Owner: `Business Owner / Content / Engineering`
- Tags: `marketing`
- Scope:
  - Add more product and project-context imagery for priority paid-media products.
  - Initial priority: BlueOcean, travertine hero products, granite, marble, limestone, and wall cladding products.
- Evidence:
  - Product image galleries are generated in `src/data/product_images.generated.ts`.
  - Current gallery coverage is shallow: most mapped products have a single image.
- Docs Impact: `Photo audit / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Priority products have at least cover, detail, and application/project-context images where assets are available.
  - New assets are added through the product photo pipeline.
  - Gallery order is reviewed so the strongest image remains the cover.

### MKT-P3-001 - Build dedicated paid-media landing pages
- Status: `Open`
- Owner: `Marketing / Engineering`
- Tags: `marketing`
- Scope:
  - Evaluate dedicated landing pages for key paid search themes instead of sending all paid traffic to generic product/index pages.
  - Candidate routes: bluestone pavers Melbourne, travertine pavers Melbourne, pool coping Melbourne, wall cladding Melbourne.
- Evidence:
  - Advertising feedback implies paid-media intent needs clearer landing experiences.
  - Current site has strong product and service routes but no paid-search-specific landing page layer.
- Docs Impact: `ARCHITECTURE / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Priority keyword themes are confirmed by marketing.
  - Landing page route plan, content outline, and conversion CTA are approved before implementation.
  - Published pages have metadata, sitemap inclusion, and conversion tracking coverage.

### MKT-P3-002 - Normalize legacy blog contact details
- Status: `Open`
- Owner: `Engineering / Content`
- Tags: `marketing`
- Scope:
  - Clean old WordPress blog phone links and contact details through the blog data generator.
  - Avoid manual edits to generated blog output.
- Evidence:
  - Legacy blog HTML in `src/data/blog.generated.ts` contains mixed phone display and `tel:` formats.
  - Blog generation is owned by `scripts/build-blog-data.py`.
- Docs Impact: `README_AGENT / NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Blog generator normalizes current business phone/email/contact links consistently.
  - Generated blog output is refreshed.
  - Sample legacy posts are verified after regeneration.

### MKT-P3-003 - Confirm credentials and proof assets
- Status: `Blocked`
- Owner: `Business Owner / Marketing`
- Tags: `marketing`
- Scope:
  - Gather business-approved proof assets before adding credential claims.
  - Candidate inputs: Google review count/rating, selected review quotes, industry associations, supplier relationships, trade references, project/customer count, client logos if permitted.
- Evidence:
  - Advertising feedback requests industry credentials and social proof.
  - These claims require business confirmation before public use.
- Docs Impact: `NEXT_STEPS / WORKLOG`
- Exit Criteria:
  - Approved proof asset list is documented.
  - Each claim has an owner-approved source.
  - Approved assets are ready to feed `MKT-P1-001`, `MKT-P1-002`, and future landing pages.

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

### Contact Conversion Contract
- Successful `/contact` submissions push `contact_form_submit` to `window.dataLayer`.
- Successful `/contact` submissions route to `/thank-you/`.
- `/thank-you/` is intentionally `noindex,nofollow` and excluded from sitemap.
- Production observability remains governed by `LAUNCH-P0-004`.

### Task Tracker Contract
- Active work tracking must use stable anchors (file + semantic marker), not line numbers.
- Active items must include `Owner`, `Evidence`, `Exit Criteria`, and `Docs Impact`.
- Marketing-originated active items must include `Tags: marketing`.

### Docs Governance Contract
- `npm run docs:check` validates active docs against current route, deployment, sitemap, contact-conversion, and task-schema contracts.
- New or changed `src/app/**/page.tsx` routes must be reflected in `docs/ARCHITECTURE.md`.
- Active docs must describe the current Pages artifact deployment model, not the old `gh-pages` publishing model.
- `docs/WORKLOG.md` is historical context only; stale historical facts do not override current code or `docs/ARCHITECTURE.md`.

### Blueocean Split Contract
- `blueocean` remains the phase-1 continuity slug and must stay routable.
- `blueocean-honed` is a dedicated generated product route sourced from `Blueocean Honed` rows in the outer CSV.
- Public display names are applied through `ProductOverride.displayName`: `blueocean` -> `BlueOcean Sawn`; `blueocean-honed` -> `BlueOcean Honed`.
- Remaining Blueocean special finishes are intentionally still grouped under `blueocean` until `P2-DATA-BLUEOCEAN-001` is executed.

## Verification Commands
```bash
npm ci
npm run docs:check
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
5. `P1-DATA-LINK-001` includes owner/evidence/exit criteria/docs impact and is visible in active board.
6. Active docs and architecture facts do not conflict with current code behavior.
7. `npm run docs:check` passes before handoff when docs/runtime/route/deploy/contact-conversion facts change.
8. Every active `LAUNCH-*`, `P1-*`, and `MKT-*` item includes `Docs Impact`.
9. Current route page files are listed in `docs/ARCHITECTURE.md`.

## Assumptions and Defaults
1. Documentation remains English-first.
2. Runtime changes are allowed when they are required to close active launch or contact-critical items.
3. Missing business inputs are tracked as `Blocked` with `Owner: TBD`.
4. WordPress cutover still requires an external redirect execution layer.
