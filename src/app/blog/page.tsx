import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/data/blog.generated";
import { buildMetadata } from "@/lib/seo";
import type { BlogPostPreview } from "@/types/blog";

export const metadata: Metadata = buildMetadata({
  title: "Blog | Aushen Stone",
  description:
    "Explore Aushen Stone articles on outdoor design, natural stone selection, pool coping, and material guidance for Melbourne projects.",
  path: "/blog/",
});

function toPreview(post: (typeof BLOG_POSTS)[number]): BlogPostPreview {
  return {
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
    categories: post.categories,
    primaryCategory: post.primaryCategory,
    heroImageUrl: post.heroImageUrl,
    excerpt: post.excerpt,
    readingTimeMinutes: post.readingTimeMinutes,
  };
}

export default function BlogPage() {
  return (
    <BlogPageClient
      posts={BLOG_POSTS.map(toPreview)}
      categories={BLOG_CATEGORIES}
    />
  );
}
