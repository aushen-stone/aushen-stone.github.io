import type { ProductOverride } from "@/types/product";

export const DEFAULT_PRODUCT_IMAGE = "/Application001.webp";

export const DEFAULT_PRODUCT_DESCRIPTION =
  "A curated natural stone selection valued for consistency, durability, and architectural character.";

export const PRODUCT_OVERRIDES: Record<string, ProductOverride> = {
  // Example:
  // "blueocean": {
  //   toneTags: ["Medium", "Cool"],
  //   description: "Volcanic bluestone with consistent mid-grey tones and a refined texture.",
  //   imageUrl: "/Application001.webp",
  // },
};
