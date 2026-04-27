export const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  "beige-travertine-sai": "Beige Travertine",
  blueocean: "BlueOcean Sawn",
  "blueocean-honed": "BlueOcean Honed",
  "classic-travertine-sai": "Classic Travertine",
  "premium-classic-travertine-artma": "Premium Classic Travertine",
  "silver-travertine-artma": "Silver Travertine",
};

export function getProductDisplayNameBySlug(
  slug: string,
  fallbackName: string
): string {
  return PRODUCT_DISPLAY_NAMES[slug] || fallbackName;
}

export function getProductDisplayName(product: {
  name: string;
  slug: string;
}): string {
  return getProductDisplayNameBySlug(product.slug, product.name);
}
