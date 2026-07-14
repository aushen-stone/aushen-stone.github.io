import type { MetadataRoute } from "next";
import { ACCESSORY_BRANDS } from "@/data/accessories";
import { BLOG_POSTS } from "@/data/blog.generated";
import { PRODUCTS } from "@/data/products.generated";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

const STATIC_ROUTES = [
  "/",
  "/about/",
  "/blog/",
  "/contact/",
  "/accessories/",
  "/products/",
  "/projects/",
  "/privacy-policy/",
  "/services/",
  "/terms-condition/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: canonicalUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority:
      path === "/"
        ? 1
        : path === "/terms-condition/" || path === "/privacy-policy/"
          ? 0.5
          : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: canonicalUrl(`/products/${product.slug}/`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: canonicalUrl(`/blog/${post.slug}/`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const accessoryEntries: MetadataRoute.Sitemap = ACCESSORY_BRANDS.map((brand) => ({
    url: canonicalUrl(brand.route),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.72,
  }));

  return [...staticEntries, ...productEntries, ...accessoryEntries, ...blogEntries];
}
