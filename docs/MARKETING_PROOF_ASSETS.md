# Marketing Proof Assets - Aushen Web

Last updated: 2026-05-01

## Purpose
This document is the source of truth for trust signals, credentials, review claims, and proof assets that marketing pages can use.

Use only `Approved` claims in public website copy. Use `Needs Confirmation` items only after a business owner approves the exact wording and source.

## Usage Rules
- Do not invent counts, certifications, awards, client logos, or partner status.
- Do not use "exclusive", "authorized", "certified", "leading", "largest", or "best" unless the exact claim has evidence and owner approval.
- Google review claims must include visible Google attribution or a link to the Google review/profile surface.
- Do not add LocalBusiness or Organization aggregate review schema for Aushen's own Google reviews. Google Search Central treats self-serving local business review markup on the business's own site as ineligible for review-star rich results.
- Product-level review schema may be considered only if Aushen directly collects product reviews on the product page and the reviews are visible on that page.

## Google Reviews Implementation Position

### What Google Officially Supports
- Google Business Profile supports review request links and QR codes for collecting reviews.
- Google Maps Platform Places API can display place details and up to five Google user reviews, but it requires API setup, attribution, and compliance with Google Maps Platform policies.
- Google Customer Reviews has an official website badge through Merchant Center, but it is for store ratings/customer surveys, not the same thing as Google Business Profile local reviews.

### Recommended Website Approach
- Phase 1: static trust badge using approved copy and a link to the Google review/profile surface.
- Phase 2: optional Places API implementation if live review snippets are required.
- Avoid third-party review widgets unless the business accepts the dependency, privacy, performance, and ongoing subscription risk.

## Approved Claims

| Claim ID | Status | Approved wording | Evidence source | Where to use | Notes |
|---|---|---|---|---|---|
| `PROOF-GOOGLE-001` | Approved | `5.0 Google Reviews` | Legacy panel footer displays `5.0 Google Reviews`; Birdeye mirrors Google rating as `5.0` with `20 reviews`. | Contact form, homepage trust band, landing pages | Pair with Google attribution/link. Do not mark up as LocalBusiness aggregate rating schema. |
| `PROOF-GOOGLE-002` | Approved | `Rated 5.0 on Google from 20 reviews` | Birdeye profile lists `Google (20)` and `5.0 20 reviews`; legacy panel displays `5.0 Google Reviews`. | Contact form, homepage trust band | Review count can change. Re-check before launch copy freeze and after major campaigns. |
| `PROOF-AGE-001` | Approved | `20 years of natural stone experience` | Legacy panel states two decades of experience and displays "20 Years of Experience"; business owner approved the claim. | Homepage, About, Contact, landing pages | Prefer "20 years" over precise "since 2003" unless business registration/date source is added. |
| `PROOF-LOCATION-001` | Approved | `Cheltenham showroom serving Melbourne homeowners, builders, landscapers, and designers` | Current site and legacy panel list `16a/347 Bay Road, Cheltenham VIC 3192`; contact surfaces show showroom context. | Contact, homepage, About, landing pages | This is a low-risk local trust signal. |
| `PROOF-DISTRIBUTOR-001` | Approved | `Distributor of Chemforce, HIDE, and FormBoss accessory products` | Business owner approved "distributor"; legacy panel and current site list Chemforce, HIDE/access lids, and FormBoss product coverage. | Accessories pages, Contact, landing pages | Do not use "exclusive distributor" or "authorized distributor" unless manufacturer confirmation is added. |
| `PROOF-FORMBOSS-001` | Approved | `FormBoss edging available through Aushen, with common showroom stock for selected heights and finishes` | Legacy FormBoss page lists product ranges and showroom stock examples. | Accessories/FormBoss page, trade-facing content | Keep wording practical. Do not imply the full FormBoss catalog is stocked onsite. |
| `PROOF-CHEMFORCE-001` | Approved | `Chemforce stone protection, sealing, and cleaning products available through Aushen` | Legacy Chemforce page lists Chemforce tile and stone protection/cleaning products; current accessories architecture includes Chemforce. | Accessories/Chemforce page, product care content | Avoid technical performance guarantees unless sourced from Chemforce material. |
| `PROOF-HIDE-001` | Approved | `HIDE access cover and skimmer lid systems available through Aushen for flush pool and paving details` | Legacy access lids page describes HIDE lids for skimmers, drains, and access points; current accessories architecture includes HIDE. | Accessories/HIDE page, pool coping landing pages | Keep product claims descriptive, not warranty/performance-heavy. |

## Approved Review Themes
Use these as paraphrased themes unless exact review snippets are pulled through an approved API or manually approved from Google Business Profile.

| Theme ID | Status | Theme | Evidence source | Safe wording |
|---|---|---|---|---|
| `REVIEW-THEME-001` | Approved | Helpful, knowledgeable customer service | Birdeye/Google mirrored reviews mention product knowledge, responsiveness, and helpful staff. | `Customers highlight knowledgeable guidance and responsive service.` |
| `REVIEW-THEME-002` | Approved | Product quality and stock availability | Birdeye/Google mirrored reviews mention stock availability, quality, and project suitability. | `Reviewers commonly mention product quality, availability, and practical selection support.` |
| `REVIEW-THEME-003` | Approved | Showroom experience | Birdeye/Google mirrored reviews and legacy site support showroom-based selection. | `Visit the Cheltenham showroom to compare stone, finishes, and accessory details in person.` |

## Approved Manual Review Excerpts
These excerpts were supplied by the business owner from Google reviews on 2026-05-01. Use them as short visible quotes only; do not add review schema markup.

| Review ID | Status | Author | Approved excerpt | Usage |
|---|---|---|---|---|
| `REVIEW-QUOTE-LISA-Q` | Approved | Lisa Q | `Beautiful blue-grey tones bring the backyard to life.` | Contact, homepage, About, landing pages |
| `REVIEW-QUOTE-JOAN-HUTCHINGS` | Approved | Joan Hutchings | `Great customer service by Hanna, who was very product knowledgeable.` | Contact, homepage, About, landing pages |
| `REVIEW-QUOTE-ROBYN-SHIELS` | Approved | Robyn Shiels | `Very knowledgeable and down to earth staff.` | Contact, homepage, About, landing pages |

## Needs Confirmation

| Claim ID | Status | Proposed wording | Needed confirmation |
|---|---|---|---|
| `PROOF-ASSOC-001` | Needs Confirmation | Industry association or certification claims | No industry association, certification, or accreditation evidence was found on the legacy panel site. Add only if documents/logos are provided. |
| `PROOF-PROJECT-COUNT-001` | Deferred | Project/customer count | Deferred by owner. Do not use numerical project/customer claims yet. |
| `PROOF-PHOTO-001` | Deferred | Real showroom/team/warehouse/project proof photos | Deferred by owner. Can be added later as page assets. |
| `PROOF-MERCHANT-BADGE-001` | Needs Confirmation | Google Customer Reviews badge | Requires Merchant Center / Google Customer Reviews participation and is not equivalent to Google Business Profile reviews. |

## Do Not Use

| Claim | Reason |
|---|---|
| `Melbourne's leading stone supplier` | Too broad without independent evidence. |
| `Australia's foremost source of natural stone` | Legacy panel wording is high-risk marketing language without supporting independent proof. |
| `largest provider of natural stone in Australia` | Found in third-party/legacy-style listings, but not suitable without strong evidence. |
| `exclusive distributor` | No manufacturer confirmation found. |
| `Google-star rich snippets on our own LocalBusiness listing` | Google's review snippet rules make self-serving LocalBusiness/Organization review markup ineligible for rich results. |

## Sources
- Google Places API policies and review attribution: https://developers.google.com/maps/documentation/places/web-service/policies
- Google Customer Reviews badge: https://support.google.com/merchants/answer/14629804
- Google Business Profile review link and QR code guidance: https://support.google.com/business/answer/3474122
- Google Search Central review snippet rules: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Legacy panel homepage: https://panel.aushenstone.com.au/
- Legacy Chemforce page: https://panel.aushenstone.com.au/stone-sealer-and-cleaner/
- Legacy FormBoss page: https://panel.aushenstone.com.au/formboss/
- Legacy HIDE/access lids page: https://panel.aushenstone.com.au/outdoor-stone-lids-covers/
- Birdeye mirrored Google reviews profile: https://reviews.birdeye.com/aushen-stone-tile-natural-stone-tiles-and-pavers-168853922274981
