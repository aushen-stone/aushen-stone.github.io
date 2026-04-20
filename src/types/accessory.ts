export type AccessoryBrandSlug = "chemforce" | "hide" | "formboss";

export type AccessoryMedia = {
  src: string;
  alt: string;
  focalPoint?: string;
  caption?: string;
};

export type AccessoryCta = {
  label: string;
  href: string;
};

export type AccessoryStat = {
  value: string;
  label: string;
  supportingText: string;
};

export type AccessoryFamily = {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  highlights: string[];
  image: AccessoryMedia;
};

export type AccessoryItem = {
  name: string;
  summary: string;
  packSizes?: string[];
  sizes?: string[];
  depths?: string[];
  finishes?: string[];
  colors?: string[];
  note?: string;
  sourceUrl?: string;
};

export type AccessoryResourceKind =
  | "official"
  | "guide"
  | "category";

export type AccessoryResource = {
  label: string;
  href: string;
  kind: AccessoryResourceKind;
};

export type AccessoryPalette = {
  surface: string;
  ink: string;
  accent: string;
  accentSoft: string;
  border: string;
};

export type AccessoryBrand = {
  slug: AccessoryBrandSlug;
  name: string;
  navLabel: string;
  route: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  coverImage: AccessoryMedia;
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    image: AccessoryMedia;
    ambientNote: string;
    primaryCta: AccessoryCta;
    secondaryCta: AccessoryCta;
  };
  stats: AccessoryStat[];
  overview: {
    heading: string;
    body: string;
    bullets: string[];
  };
  projectApplications: string[];
  families: AccessoryFamily[];
  coreItems: AccessoryItem[];
  resources: AccessoryResource[];
  cta: {
    heading: string;
    body: string;
    primary: AccessoryCta;
    secondary: AccessoryCta;
  };
  palette: AccessoryPalette;
};
