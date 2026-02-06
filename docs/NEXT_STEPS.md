# Next Steps - Aushen Web

Last updated: 2026-02-06

## Current Release Goal
Ship a stable, mobile-safe release where core navigation and routing work reliably across small screens, and the project passes engineering gates (`lint`, `tsc`, `build`) in this environment.

## P0
No open P0 blockers.

## P1

### 1) Reduce Remaining Lint Warnings (Image Optimization)
- Problem: `eslint` has no errors, but still reports 20 warnings (`@next/next/no-img-element`) across feature pages.
- Files:
  - `src/app/about/page.tsx`
  - `src/app/components/BestSellers.tsx`
  - `src/app/components/BrandBanner.tsx`
  - `src/app/components/CreativeHubSection.tsx`
  - `src/app/components/Footer.tsx`
  - `src/app/components/Hero.tsx`
  - `src/app/components/Navbar.tsx`
  - `src/app/components/ProjectShowcase.tsx`
  - `src/app/components/ServicesSection.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/projects/page.tsx`
  - `src/app/projects/[id]/page.tsx`
  - `src/app/services/page.tsx`
- Action: Migrate high-impact visual assets from `<img>` to `next/image`, then configure `images.remotePatterns` in `next.config.ts` for external hosts.
- Definition of Done: `npm run lint` returns `0 errors, 0 warnings` (or warnings explicitly documented and intentionally suppressed).

### 2) Stabilize Content/CTA Behavior for Production
- Problem: Several CTA buttons are visual-only and do not execute real actions yet.
- Files:
  - `src/app/components/Hero.tsx`
  - `src/app/components/CreativeHubSection.tsx`
  - `src/app/services/page.tsx`
  - `src/app/contact/page.tsx`
- Action: Replace placeholder buttons with real links/forms or convert them to explicit disabled states with clear copy.
- Definition of Done: Every primary CTA either navigates, submits, or is clearly marked unavailable.

### 3) Consolidate Responsive QA Baseline
- Problem: Key mobile issues were fixed, but responsive quality still depends on ad-hoc manual checks.
- Files:
  - `src/app/components/Navbar.tsx`
  - `src/app/components/ProductSidebar.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/projects/page.tsx`
  - `src/app/globals.css`
- Action: Add a lightweight viewport QA checklist and keep sticky offsets synchronized with navbar height conventions.
- Definition of Done: 320/375/390/768/1024 checks show no horizontal overflow and no sticky overlap regressions.

## P2/Backlog

### 1) Replace Mock Project Detail Data with a Real Source
- Problem: `/projects/[id]` resolves route params correctly, but content is still hard-coded in file.
- Files:
  - `src/app/projects/[id]/page.tsx`
- Action: Move project detail content into a typed data module or CMS source while keeping route behavior intact.
- Definition of Done: Project detail content updates do not require editing route component code.

### 2) Add Automated UI Regression Coverage
- Problem: Mobile menu/drawer and route-level behavior are protected by manual checks only.
- Files:
  - `src/app/components/Navbar.tsx`
  - `src/app/products/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/projects/[id]/page.tsx`
- Action: Add e2e coverage (Playwright or equivalent) for mobile nav, product filter drawer, and dynamic project detail route.
- Definition of Done: CI catches regressions for open/close behavior, focus trap, and route-driven rendering.

## Exit Criteria
- `npm run lint` has no errors.
- `npx tsc --noEmit` passes.
- `npm run build` passes in this environment.
- Mobile navigation, services interaction, and dynamic project detail routing remain functional on 320/375/390 widths.

## Verification Commands
```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual smoke:
```bash
npm run dev
```
Then verify:
- mobile menu open/close via button, overlay, and ESC
- services list interaction via click/tap (not hover-only)
- `/projects/[id]` renders by slug and returns fallback for unknown id
