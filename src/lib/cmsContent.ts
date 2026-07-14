import type { CmsEntityType } from "@/types/cms";
import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";
import type { LegacyAboutContent, LegacyHomeContent, LegacyPageContentMap, LegacyServicesContent, ManagedProject } from "@/types/siteContent";

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

export function applyLegacyPageHeroImage(
  entity: "home" | "services" | "about",
  content: Record<string, unknown>,
  imageUrl: string | null
) {
  if (!imageUrl) return content;
  // Services has a text-only hero. Its existing page-level image represents
  // the first fabrication card, so keep that established mapping editable.
  if (entity === "services") {
    const fabrication = content.fabrication;
    if (!fabrication || typeof fabrication !== "object" || Array.isArray(fabrication)) return content;
    const items = (fabrication as { items?: unknown }).items;
    if (!Array.isArray(items) || !items[0] || typeof items[0] !== "object" || Array.isArray(items[0])) return content;
    return {
      ...content,
      fabrication: {
        ...fabrication,
        items: [{ ...items[0], image: imageUrl }, ...items.slice(1)],
      },
    };
  }
  const hero = content.hero;
  if (!hero || typeof hero !== "object" || Array.isArray(hero)) return content;
  return { ...content, hero: { ...hero, image: imageUrl } };
}

export function buildCmsContent(entity: "products", input: CmsContentInput): Product & { description: string };
export function buildCmsContent(entity: "blog", input: CmsContentInput): BlogPost;
export function buildCmsContent(entity: "projects", input: CmsContentInput): ManagedProject;
export function buildCmsContent(entity: "home", input: CmsContentInput): LegacyHomeContent;
export function buildCmsContent(entity: "services", input: CmsContentInput): LegacyServicesContent;
export function buildCmsContent(entity: "about", input: CmsContentInput): LegacyAboutContent;
export function buildCmsContent(entity: CmsEntityType, input: CmsContentInput): (Product & { description: string }) | BlogPost | ManagedProject | NonNullable<LegacyPageContentMap[keyof LegacyPageContentMap]>;
export function buildCmsContent(entity: CmsEntityType, input: CmsContentInput): (Product & { description: string }) | BlogPost | ManagedProject | NonNullable<LegacyPageContentMap[keyof LegacyPageContentMap]> {
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

  if (entity === "projects") {
    const projectCategory = input.secondaryLabel || input.categories.split(",")[0]?.trim() || "Residential";
    return {
      ...advanced,
      slug: input.slug,
      title: input.title,
      category: projectCategory,
      location: String(advanced.location ?? "Melbourne, Victoria"),
      year: String(advanced.year ?? new Date().getFullYear()),
      image: input.imageUrl || String(advanced.image ?? ""),
      aspect: String(advanced.aspect ?? "aspect-[16/10]"),
      gridArea: (advanced.gridArea === "right" || advanced.gridArea === "center" ? advanced.gridArea : "left"),
      tags: Array.isArray(advanced.tags) ? advanced.tags as string[] : [projectCategory],
      credits: typeof advanced.credits === "object" && advanced.credits ? advanced.credits as ManagedProject["credits"] : { architect: "", builder: "", landscaper: "", photographer: "" },
      description: input.summary,
      gallery: Array.isArray(advanced.gallery) ? advanced.gallery as ManagedProject["gallery"] : input.imageUrl ? [{ type: "full", src: input.imageUrl, alt: input.title }] : [],
      products: Array.isArray(advanced.products) ? advanced.products as ManagedProject["products"] : [],
    } as ManagedProject;
  }

  if (entity === "home" || entity === "services" || entity === "about") {
    return advanced as NonNullable<LegacyPageContentMap[typeof entity]>;
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
