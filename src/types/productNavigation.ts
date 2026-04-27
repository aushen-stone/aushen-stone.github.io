export const PRODUCTS_RETURN_CONTEXT_STORAGE_KEY =
  "aushen_products_return_context_v1";

export const PRODUCT_CONTACT_HANDOFF_KEY =
  "aushen_product_contact_prefill_v1";

export type ProductsReturnContext = {
  href: string;
  productSlug: string;
  scrollY: number;
  savedAt: string;
};
