import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products.generated";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

const STATIC_ROUTES = ["/", "/about/", "/contact/", "/products/", "/projects/", "/services/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: canonicalUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: canonicalUrl(`/products/${product.slug}/`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
