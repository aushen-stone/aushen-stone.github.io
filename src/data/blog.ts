import { CMS_BLOG_POSTS, CMS_BLOG_POSTS_SYNCED } from "@/data/cms-blog.generated";
import { BLOG_POSTS as LEGACY_BLOG_POSTS } from "@/data/blog.generated";
import type { BlogCategory } from "@/types/blog";

export const BLOG_POSTS = CMS_BLOG_POSTS_SYNCED
  ? CMS_BLOG_POSTS
  : LEGACY_BLOG_POSTS;

const categoryCounts = new Map<string, BlogCategory>();
for (const post of BLOG_POSTS) {
  for (const category of post.categories) {
    const existing = categoryCounts.get(category.slug);
    categoryCounts.set(category.slug, {
      ...category,
      count: (existing?.count ?? 0) + 1,
    });
  }
}
export const BLOG_CATEGORIES = Array.from(categoryCounts.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);
