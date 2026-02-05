export type Material = {
  id: string;
  name: string;
  slug: string;
};

export type Size = {
  raw: string;
  unit: "mm";
  lengthMm?: number;
  widthMm?: number;
  thicknessMm?: number | [number, number];
  heightMm?: number;
};

export type ApplicationOffer = {
  id: string;
  label: string;
  category: string;
  categorySlug: string;
  subtype?: string;
  subtypeSlug?: string;
  sizes: Size[];
};

export type ApplicationFinishOffer = {
  id: string;
  name: string;
  slipRating?: string;
  sizes: Size[];
};

export type ApplicationIndexEntry = {
  id: string;
  label: string;
  category: string;
  categorySlug: string;
  subtype?: string;
  subtypeSlug?: string;
  finishes: ApplicationFinishOffer[];
};

export type FinishVariant = {
  id: string;
  name: string;
  slipRating?: string;
  applications: ApplicationOffer[];
};

export type MediaStatus = {
  productPhoto?: "Y" | "N";
  applicationPhoto?: {
    have: number;
    target: number;
  };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  materialId: string;
  materialName: string;
  finishes: FinishVariant[];
  applicationIndex: ApplicationIndexEntry[];
  media?: MediaStatus;
};

export type ProductCategory = {
  name: string;
  slug: string;
  subtypes?: { name: string; slug: string }[];
};

export type ProductCategories = {
  materials: { name: string; slug: string }[];
  applications: ProductCategory[];
};

export type ProductOverride = {
  toneTags?: string[];
  description?: string;
  imageUrl?: string;
};
