import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BlogPost } from "../src/types/blog";
import type { Product, ProductOverride } from "../src/types/product";
import type { LegacyPageContentMap, ManagedPage, ManagedProject } from "../src/types/siteContent";
import type { SeoLandingPage } from "../src/types/seoLandingPage";
import { applyLegacyPageHeroImage } from "../src/lib/cmsContent";
import { prepareBlogHtml } from "../src/lib/blogHtml";
import { DEFAULT_SEO_LANDING_PAGES } from "../src/data/seo-landing-page.defaults";
import { cmsMediaStaticPath } from "../src/lib/cmsMediaPaths";

type ProductRow = {
  slug: string;
  image_url: string | null;
  content: Product & { description?: string; applicationImageUrls?: string[] };
};
type BlogRow = { hero_image_url: string | null; content: BlogPost };
type PageRow = {
  page_key: ManagedPage["key"];
  title: string;
  hero_image_url: string | null;
  content: Record<string, unknown> & { blocks?: ManagedPage["blocks"] };
};
type ProjectRow = { hero_image_url: string | null; content: ManagedProject };
type SeoPageRow = {
  slug: string;
  page_type: SeoLandingPage["kind"];
  title: string;
  content: Omit<SeoLandingPage, "slug" | "kind" | "h1"> & { h1?: string };
};

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
// Static builds only read published rows, so the publishable key plus RLS is
// sufficient. A service-role key remains supported for trusted local tooling,
// but never needs to be stored in GitHub Actions.
const buildKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !buildKey) {
  console.log("cms:sync skipped (Supabase build variables are not configured)");
  process.exit(0);
}
const buildUrl = url;
const authorizedBuildKey = buildKey;

const publicCmsMediaRoot = path.join(process.cwd(), "public", "cms-media");

const collectCmsMediaUrls = (value: unknown, result: Set<string>): void => {
  if (typeof value === "string") {
    if (cmsMediaStaticPath(value, buildUrl)) result.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectCmsMediaUrls(item, result));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectCmsMediaUrls(item, result));
  }
};

const replaceCmsMediaUrls = (value: unknown, replacements: Map<string, string>): unknown => {
  if (typeof value === "string") return replacements.get(value) ?? value;
  if (Array.isArray(value)) {
    return value.map((item) => replaceCmsMediaUrls(item, replacements));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceCmsMediaUrls(item, replacements),
      ]),
    );
  }
  return value;
};

const listFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return files.flat();
};

async function localizeCmsMedia<T>(
  value: T,
): Promise<{ value: T; downloaded: number; removed: number }> {
  const urls = new Set<string>();
  collectCmsMediaUrls(value, urls);
  const entries = [...urls].map((sourceUrl) => ({
    sourceUrl,
    staticPath: cmsMediaStaticPath(sourceUrl, buildUrl),
  })).filter((entry): entry is { sourceUrl: string; staticPath: string } => Boolean(entry.staticPath));
  const replacements = new Map(entries.map((entry) => [entry.sourceUrl, entry.staticPath]));
  const referencedFiles = new Set(
    entries.map((entry) =>
      path.normalize(
        path.join(
          publicCmsMediaRoot,
          ...entry.staticPath
            .slice("/cms-media/".length)
            .split("/")
            .map((segment) => decodeURIComponent(segment)),
        ),
      ),
    ),
  );
  let downloaded = 0;
  let cursor = 0;

  await mkdir(publicCmsMediaRoot, { recursive: true });
  const downloadNext = async () => {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      const relativePath = entry.staticPath.slice("/cms-media/".length)
        .split("/")
        .map((segment) => decodeURIComponent(segment));
      const destination = path.join(publicCmsMediaRoot, ...relativePath);
      const existing = await stat(destination).catch(() => null);
      if (existing?.isFile() && existing.size > 0) continue;

      const response = await fetch(entry.sourceUrl);
      if (!response.ok) {
        throw new Error(`Unable to localize CMS media: ${response.status} ${entry.staticPath}`);
      }
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, Buffer.from(await response.arrayBuffer()));
      downloaded += 1;
    }
  };

  await Promise.all(Array.from({ length: 12 }, () => downloadNext()));
  const staleFiles = (await listFiles(publicCmsMediaRoot)).filter(
    (file) => !referencedFiles.has(path.normalize(file)),
  );
  await Promise.all(staleFiles.map((file) => unlink(file)));
  return {
    value: replaceCmsMediaUrls(value, replacements) as T,
    downloaded,
    removed: staleFiles.length,
  };
}

async function readRows<T>(table: string): Promise<T[]> {
  const response = await fetch(
    `${buildUrl}/rest/v1/${table}?status=eq.published&select=*&order=updated_at.desc`,
    {
      headers: {
        apikey: authorizedBuildKey,
        Authorization: `Bearer ${authorizedBuildKey}`,
      },
    }
  );
  if (!response.ok) {
    const detail = await response.text();
    const quotaRestricted = response.status === 402 && /egress|quota|spend/i.test(detail);
    if (quotaRestricted) {
      throw new Error(`CMS_QUOTA_RESTRICTED:${table}:${response.status}`);
    }
    throw new Error(`CMS sync failed for ${table}: ${response.status} ${detail.slice(0, 180)}`);
  }
  return (await response.json()) as T[];
}

let productRows: ProductRow[];
let blogRows: BlogRow[];
let pageRows: PageRow[];
let projectRows: ProjectRow[];
let seoPageRows: SeoPageRow[];
try {
  [productRows, blogRows, pageRows, projectRows, seoPageRows] = await Promise.all([
    readRows<ProductRow>("cms_products"),
    readRows<BlogRow>("cms_blog_posts"),
    readRows<PageRow>("cms_pages"),
    readRows<ProjectRow>("cms_projects"),
    readRows<SeoPageRow>("cms_seo_pages"),
  ]);
} catch (error) {
  // Supabase can temporarily restrict REST egress when the free-plan quota is
  // exhausted. Preserve the last verified, checked-in CMS snapshot so an SEO
  // code deployment cannot erase the live catalogue. Other failures remain
  // fatal because silently publishing stale content would hide real defects.
  if (error instanceof Error && error.message.startsWith("CMS_QUOTA_RESTRICTED:")) {
    console.warn("cms:sync using the checked-in snapshot because Supabase REST egress is temporarily restricted");
    process.exit(0);
  }
  throw error;
}

const localizedCms = await localizeCmsMedia({
  productRows,
  blogRows,
  pageRows,
  projectRows,
  seoPageRows,
});
({ productRows, blogRows, pageRows, projectRows, seoPageRows } = localizedCms.value);
console.log(
  `cms:sync localized ${localizedCms.downloaded} new files and removed ${localizedCms.removed} stale files across published CMS media`,
);

// Older CMS uploads accidentally persisted transient browser `File` objects
// inside media variant metadata. They arrive through PostgREST as `{}` and are
// not part of the public Product contract, so remove them while generating the
// static snapshot. New uploads are also sanitized at the upload boundary.
const products = productRows.map((row) =>
  JSON.parse(
    JSON.stringify(row.content, (key, value) =>
      key === "file" ? undefined : value,
    ),
  ) as Product,
);
// Keep the dedicated image columns authoritative. This also protects content
// edited directly in Supabase or migrated from an older CMS payload shape.
const posts = blogRows.map((row) => {
  const article = prepareBlogHtml(row.content.bodyHtml);
  return {
    ...row.content,
    heroImageUrl: row.hero_image_url ?? row.content.heroImageUrl,
    bodyHtml: article.html,
    headings: article.headings,
  };
});
const pages = Object.fromEntries(pageRows.map((row) => [row.page_key, { key: row.page_key, title: row.title, heroImageUrl: row.hero_image_url, blocks: row.content.blocks ?? [] }])) as Partial<Record<ManagedPage["key"], ManagedPage>>;
// The page payload is also emitted verbatim for the legacy component adapters.
// Old `{ blocks: [...] }` rows remain harmless because every adapter validates
// optional fields and falls back to the original hard-coded copy.
const legacyPages = Object.fromEntries(
  pageRows.map((row) => [
    row.page_key,
    applyLegacyPageHeroImage(row.page_key, row.content, row.hero_image_url),
  ])
) as LegacyPageContentMap;
const projects = projectRows.map((row) => ({
  ...row.content,
  image: row.hero_image_url ?? row.content.image,
}));
const syncedSeoPages: SeoLandingPage[] = seoPageRows.map((row) => ({
  ...row.content,
  slug: row.slug,
  kind: row.page_type,
  h1: row.content.h1 || row.title,
  catalogueDescription: typeof row.content.catalogueDescription === "string" ? row.content.catalogueDescription : undefined,
  productSlugs: Array.isArray(row.content.productSlugs) ? row.content.productSlugs : [],
  sections: Array.isArray(row.content.sections) ? row.content.sections : [],
  faqs: Array.isArray(row.content.faqs) ? row.content.faqs : [],
  exploreLinks: Array.isArray(row.content.exploreLinks) ? row.content.exploreLinks : [],
}));
// The reviewed consultant pages are the launch baseline. CMS rows override
// matching pages and may add new material/application pages later.
const seoPagesByKey = new Map(DEFAULT_SEO_LANDING_PAGES.map((page) => [`${page.kind}:${page.slug}`, page]));
syncedSeoPages.forEach((page) => {
  const key = `${page.kind}:${page.slug}`;
  const fallback = seoPagesByKey.get(key);
  seoPagesByKey.set(key, {
    ...fallback,
    ...page,
    catalogueDescription: page.catalogueDescription || fallback?.catalogueDescription || page.intro,
  });
});
const seoPages = [...seoPagesByKey.values()];

// Legacy catalogue rows reference full-size files in /product-photos. Static
// responsive variants use the same filename, so builds can switch them without
// changing the CMS record or deleting the rollback-safe original.
const localProductVariant = (
  value: string | null | undefined,
  variant: "thumbnail" | "large",
) => {
  if (!value?.startsWith("/product-photos/")) return value ?? undefined;
  const fileName = value.slice("/product-photos/".length);
  return `/${variant === "thumbnail" ? "product-thumbnails-v2" : "product-large-v2"}/${fileName}`;
};

// Fail the deployment instead of publishing malformed dynamic routes.
for (const product of products) {
  if (!product.slug || !product.name || !Array.isArray(product.finishes) || !Array.isArray(product.applicationIndex)) {
    throw new Error(`Invalid published product payload: ${product.slug || "missing-slug"}`);
  }
}
for (const post of posts) {
  if (!post.slug || !post.title || typeof post.bodyHtml !== "string") {
    throw new Error(`Invalid published blog payload: ${post.slug || "missing-slug"}`);
  }
}
for (const project of projects) {
  if (!project.slug || !project.title || !Array.isArray(project.gallery)) {
    throw new Error(`Invalid published project payload: ${project.slug || "missing-slug"}`);
  }
}
for (const page of seoPages) {
  if (!page.slug || !page.h1 || !page.metaTitle || !page.metaDescription) {
    throw new Error(`Invalid published SEO page payload: ${page.slug || "missing-slug"}`);
  }
}
const overrides = Object.fromEntries(
  productRows.map((row) => [
    row.slug,
    {
      imageUrl:
        localProductVariant(
          row.content.mediaAssets?.product?.large.url,
          "large",
        ) ??
        localProductVariant(row.image_url, "large"),
      imageThumbnailUrl:
        localProductVariant(
          row.content.mediaAssets?.product?.thumbnail.url,
          "thumbnail",
        ) ??
        localProductVariant(row.image_url, "thumbnail"),
      imageUrls: [
        localProductVariant(
          row.content.mediaAssets?.product?.large.url,
          "large",
        ) ??
          localProductVariant(row.image_url, "large"),
        ...(row.content.applicationImageUrls ?? []).map((value) =>
          localProductVariant(value, "large"),
        ),
      ].filter((value): value is string => Boolean(value)),
      applicationImageUrls: (row.content.applicationImageUrls ?? []).map(
        (value) => localProductVariant(value, "large") ?? value,
      ),
      applicationThumbnailUrls:
        row.content.mediaAssets?.applications?.map(
          (asset) =>
            localProductVariant(asset.thumbnail.url, "thumbnail") ??
            asset.thumbnail.url,
        ) ??
        (row.content.applicationImageUrls ?? []).map(
          (value) => localProductVariant(value, "thumbnail") ?? value,
        ),
      description: row.content.description,
    } satisfies ProductOverride,
  ])
);

const root = process.cwd();
const generatedBanner = "// Generated by scripts/sync-cms-data.ts. Do not edit manually.\n";
await Promise.all([
  writeFile(
    path.join(root, "src/data/cms-products.generated.ts"),
    `${generatedBanner}import type { Product } from "@/types/product";\nexport const CMS_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};\nexport const CMS_PRODUCTS_SYNCED = true;\n`
  ),
  writeFile(
    path.join(root, "src/data/cms-blog.generated.ts"),
    `${generatedBanner}import type { BlogPost } from "@/types/blog";\nexport const CMS_BLOG_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)};\nexport const CMS_BLOG_POSTS_SYNCED = true;\n`
  ),
  writeFile(
    path.join(root, "src/data/cms-product-overrides.generated.ts"),
    `${generatedBanner}import type { ProductOverride } from "@/types/product";\nexport const CMS_PRODUCT_OVERRIDES: Record<string, ProductOverride> = ${JSON.stringify(overrides, null, 2)};\n`
  ),
  writeFile(
    path.join(root, "src/data/cms-site.generated.ts"),
    `${generatedBanner}import type { LegacyPageContentMap, ManagedPage, ManagedProject } from "@/types/siteContent";\nexport const CMS_MANAGED_PAGES: Partial<Record<ManagedPage["key"], ManagedPage>> = ${JSON.stringify(pages, null, 2)};\nexport const CMS_MANAGED_PROJECTS: ManagedProject[] = ${JSON.stringify(projects, null, 2)};\nexport const CMS_LEGACY_PAGES: LegacyPageContentMap = ${JSON.stringify(legacyPages, null, 2)};\nexport const CMS_SITE_CONTENT_SYNCED = true;\n`
  ),
  writeFile(
    path.join(root, "src/data/cms-seo-pages.generated.ts"),
    `${generatedBanner}import type { SeoLandingPage } from "@/types/seoLandingPage";\nexport const CMS_SEO_LANDING_PAGES: SeoLandingPage[] = ${JSON.stringify(seoPages, null, 2)};\nexport const CMS_SEO_LANDING_PAGES_SYNCED = true;\n`
  ),
]);

console.log(`cms:sync wrote ${products.length} products, ${posts.length} blog posts, ${Object.keys(pages).length} pages, ${projects.length} projects and ${seoPages.length} SEO pages`);
