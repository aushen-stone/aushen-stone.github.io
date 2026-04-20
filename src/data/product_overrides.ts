import {
  PRODUCT_COVER_IMAGES,
  PRODUCT_IMAGE_GALLERIES,
} from "@/data/product_images.generated";
import type { ProductOverride } from "@/types/product";

export const DEFAULT_PRODUCT_IMAGE = "/Application001.webp";

export const DEFAULT_PRODUCT_DESCRIPTION =
  "A curated natural stone selection valued for consistency, durability, and architectural character.";

export const DEFAULT_HOMEOWNER_SUMMARY =
  "Ideal for projects that need visual warmth, durable performance, and a finish that feels timeless in everyday use.";

export const DEFAULT_HOMEOWNER_USE_CASES = [
  "Poolside and alfresco areas where slip confidence matters.",
  "Garden paths and courtyards that need natural texture.",
  "Outdoor entertaining zones with a refined architectural look.",
];

export const DEFAULT_PROFESSIONAL_SUMMARY =
  "Specify by application and finish quickly, then validate slip rating and size combinations for project delivery.";

export const DEFAULT_PROFESSIONAL_NOTES = [
  "Confirm finish and slip rating against project compliance requirements.",
  "Check available sizes early to reduce custom cutting and waste.",
  "Coordinate lead times for matching pieces across adjoining zones.",
];

const GENERATED_IMAGE_OVERRIDES: Record<string, ProductOverride> = Object.fromEntries(
  Object.entries(PRODUCT_IMAGE_GALLERIES).map(([slug, imageUrls]) => [
    slug,
    {
      imageUrl: PRODUCT_COVER_IMAGES[slug] || imageUrls[0],
      imageUrls,
    },
  ])
);

const MANUAL_PRODUCT_OVERRIDES: Record<string, ProductOverride> = {
  "blueocean-honed": {
    description:
      "Blueocean Honed offers the cooler Blueocean bluestone palette with a smoother, more architectural face for refined paving, coping, and feature applications.",
    homeownerSummary:
      "Ideal for projects that want Blueocean's cool tonal depth with a cleaner, smoother finish underfoot and around entertaining zones.",
    professionalSummary:
      "Use Blueocean Honed when the project calls for the Blueocean palette in a more refined honed specification across paving, coping, and matching detail elements.",
    professionalNotes: [
      "Confirm honed slip performance against the intended wet-area or poolside compliance requirements.",
      "Check matching coping, pattern, and kerb availability early because the honed range is narrower than the continuity Blueocean slug.",
      "Coordinate visual mockups against the sawn range when the finish change materially affects perceived colour and light reflectance.",
    ],
  },
};

const buildProductOverrides = (): Record<string, ProductOverride> => {
  const slugs = new Set([
    ...Object.keys(GENERATED_IMAGE_OVERRIDES),
    ...Object.keys(MANUAL_PRODUCT_OVERRIDES),
  ]);
  const result: Record<string, ProductOverride> = {};

  slugs.forEach((slug) => {
    result[slug] = {
      ...(GENERATED_IMAGE_OVERRIDES[slug] || {}),
      ...(MANUAL_PRODUCT_OVERRIDES[slug] || {}),
    };
  });

  return result;
};

export const PRODUCT_OVERRIDES: Record<string, ProductOverride> = buildProductOverrides();
