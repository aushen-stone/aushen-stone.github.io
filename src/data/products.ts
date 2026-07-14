import { CMS_PRODUCTS, CMS_PRODUCTS_SYNCED } from "@/data/cms-products.generated";
import { PRODUCTS as LEGACY_PRODUCTS } from "@/data/products.generated";

// Existing generated content keeps local development usable before CMS setup.
export const PRODUCTS = CMS_PRODUCTS_SYNCED ? CMS_PRODUCTS : LEGACY_PRODUCTS;
