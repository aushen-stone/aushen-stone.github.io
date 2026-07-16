import type { Product } from "@/types/product";

export const MATERIAL_FILTER_OPTIONS = [
  { name: "Bluestone", slug: "bluestone" },
  { name: "Limestone", slug: "limestone" },
  { name: "Marble", slug: "marble" },
  { name: "Travertine", slug: "travertine" },
  { name: "Granite", slug: "granite" },
  { name: "Quartz", slug: "quartz" },
  { name: "Sandstone", slug: "sandstone" },
  { name: "Porcelain", slug: "porcelain" },
  { name: "Brick", slug: "reclaimed-brick" },
  { name: "Permeable Paver", slug: "permeable-paver" },
] as const;

export const PREFERRED_APPLICATION_FILTER_OPTIONS = [
  { name: "Paver", slug: "paver" },
  { name: "Pool Coping", slug: "pool-coping" },
  { name: "Cladding", slug: "cladding" },
  { name: "Crazy Paver", slug: "crazy-paver" },
  { name: "Cobble Stone", slug: "cobble-stone" },
  { name: "Organic Stepper", slug: "organic-stepper" },
  { name: "Giant Stepper", slug: "giant-stepper" },
  { name: "Patterns", slug: "patterns" },
  { name: "Kerb", slug: "kerb" },
  { name: "Pitcher", slug: "pitcher" },
  { name: "Slab", slug: "slab" },
  { name: "Organic Table and Seat", slug: "organic-table-and-seat" },
] as const;

export type ProductFilterOption = { name: string; slug: string };

// Keep the agreed business order, then append any new CMS category so an
// administrator-created application is immediately available to shoppers.
export function buildApplicationFilterOptions(
  products: Product[],
): ProductFilterOption[] {
  const options = new Map<string, string>(
    PREFERRED_APPLICATION_FILTER_OPTIONS.map(({ name, slug }) => [slug, name]),
  );

  for (const product of products) {
    for (const application of product.applicationIndex) {
      if (application.categorySlug && !options.has(application.categorySlug)) {
        options.set(application.categorySlug, application.category || application.label);
      }
    }
  }

  const preferredSlugs = new Set<string>(
    PREFERRED_APPLICATION_FILTER_OPTIONS.map(({ slug }) => slug),
  );
  const custom = Array.from(options, ([slug, name]) => ({ slug, name }))
    .filter(({ slug }) => !preferredSlugs.has(slug))
    .sort((left, right) => left.name.localeCompare(right.name, "en-AU"));

  return [...PREFERRED_APPLICATION_FILTER_OPTIONS, ...custom];
}
