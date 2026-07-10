import type { CmsEntityType } from "@/types/cms";
import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";

export type CmsContentInput = {
  title: string;
  slug: string;
  secondaryLabel: string;
  imageUrl: string;
  summary: string;
  bodyHtml: string;
  categories: string;
  advancedJson: string;
};

export const slugifyCmsValue = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function buildCmsContent(entity: "products", input: CmsContentInput): Product & { description: string };
export function buildCmsContent(entity: "blog", input: CmsContentInput): BlogPost;
export function buildCmsContent(entity: CmsEntityType, input: CmsContentInput): (Product & { description: string }) | BlogPost;
export function buildCmsContent(entity: CmsEntityType, input: CmsContentInput): (Product & { description: string }) | BlogPost {
  // Advanced JSON preserves legacy nested fields while common fields stay easy to edit.
  const advanced = JSON.parse(input.advancedJson || "{}") as Record<string, unknown>;
  if (entity === "products") {
    return {
      ...advanced,
      id: input.slug,
      name: input.title,
      slug: input.slug,
      materialId: slugifyCmsValue(input.secondaryLabel),
      materialName: input.secondaryLabel,
      finishes: Array.isArray(advanced.finishes) ? advanced.finishes : [],
      applicationIndex: Array.isArray(advanced.applicationIndex)
        ? advanced.applicationIndex
        : [],
      description: input.summary,
    } as Product & { description: string };
  }

  const categoryRefs = input.categories
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ name, slug: slugifyCmsValue(name) }));
  return {
    ...advanced,
    title: input.title,
    slug: input.slug,
    publishedAt: String(advanced.publishedAt ?? new Date().toISOString()),
    author: String(advanced.author ?? "Aushen Stone"),
    categories: categoryRefs,
    primaryCategory: categoryRefs[0] ?? null,
    heroImageUrl: input.imageUrl || null,
    excerpt: input.summary,
    bodyHtml: input.bodyHtml,
    headings: Array.isArray(advanced.headings) ? advanced.headings : [],
    readingTimeMinutes: Number(advanced.readingTimeMinutes ?? 3),
    seoTitle: String(advanced.seoTitle ?? input.title),
    seoDescription: String(advanced.seoDescription ?? input.summary),
  } as BlogPost;
}
