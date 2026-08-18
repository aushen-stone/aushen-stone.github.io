import { PRODUCTS } from "@/data/products";
import { getProductDisplayName } from "@/data/product_display_names";
import type { SeoLandingPage } from "@/types/seoLandingPage";

const slugify = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const APPLICATION_ALIASES: Record<string, string[]> = {
  cobblestone: ["cobblestone", "cobble-stone"],
  "crazy-paving": ["crazy-paving", "crazy-paver"],
  pavers: ["pavers", "paver"],
};

export function seoLandingPageMatchesFilter(
  page: Pick<SeoLandingPage, "kind" | "slug">,
  kind: "material" | "application",
  filterSlug: string,
) {
  if (page.kind !== kind) return false;
  if (kind === "material") return page.slug === filterSlug;
  return (APPLICATION_ALIASES[page.slug] ?? [page.slug]).includes(filterSlug);
}

export function getSeoLandingPageMatchingProducts(page: Pick<SeoLandingPage, "kind" | "slug">) {
  return PRODUCTS.filter((product) => {
    if (page.kind === "material") return product.materialId === page.slug;
    const accepted = new Set(APPLICATION_ALIASES[page.slug] ?? [page.slug]);
    return product.applicationIndex.some((application) =>
      accepted.has(application.categorySlug) ||
      accepted.has(application.id) ||
      accepted.has(slugify(application.label)),
    );
  }).toSorted((a, b) => getProductDisplayName(a).localeCompare(getProductDisplayName(b)));
}

export function getSeoLandingPageProducts(page: SeoLandingPage) {
  const selected = new Set(page.productSlugs);
  return getSeoLandingPageMatchingProducts(page).filter((product) =>
    selected.size ? selected.has(product.slug) : true,
  );
}

export function seoLandingPagePath(page: Pick<SeoLandingPage, "kind" | "slug">) {
  return `/products/${page.kind}/${page.slug}/`;
}
