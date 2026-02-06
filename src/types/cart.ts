export const SAMPLE_SIZE = "200x100mm";
export const MAX_SAMPLE_LINES = 10;

export const SAMPLE_CART_STORAGE_KEY = "aushen_sample_cart_v1";
export const SAMPLE_CART_CONTACT_HANDOFF_KEY =
  "aushen_sample_cart_contact_prefill_v1";

export type SampleCartLine = {
  productSlug: string;
  productName: string;
  finishId: string;
  finishName: string;
  sampleSize: typeof SAMPLE_SIZE;
  addedAt: string;
};

export type AddSampleInput = {
  productSlug: string;
  productName: string;
  finishId: string;
  finishName: string;
};

export type AddSampleResult = "added" | "exists" | "limit_reached";
