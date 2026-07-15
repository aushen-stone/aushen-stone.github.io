import sanitizeHtml from "sanitize-html";
import type { BlogHeading } from "@/types/blog";

const BLOG_ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "h4",
  "b",
  "i",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "figure",
  "figcaption",
  "hr",
  "br",
];

/** Keep CMS-authored blog markup useful while removing executable HTML. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: BLOG_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
      }),
    },
  });
}

function decodeHtmlText(value: string): string {
  const withoutTags = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  return withoutTags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

function headingSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

/** Sanitize article markup and keep the visible table of contents in sync. */
export function prepareBlogHtml(html: string): {
  html: string;
  headings: BlogHeading[];
} {
  const headings: BlogHeading[] = [];
  const usedIds = new Set<string>();
  const clean = sanitizeBlogHtml(html).replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, levelValue: string, attributes: string, innerHtml: string) => {
      const text = decodeHtmlText(innerHtml);
      const existingId = attributes.match(/\sid=["']([^"']+)["']/i)?.[1];
      const baseId = headingSlug(existingId || text);
      let id = baseId;
      let suffix = 2;
      while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
      usedIds.add(id);
      const level = Number(levelValue) as 2 | 3;
      headings.push({ id, text, level });
      return `<h${level} id="${id}">${innerHtml}</h${level}>`;
    },
  );
  return { html: clean, headings };
}
