import { BLOG_POSTS } from "@/data/blog.generated";
import type { BlogPost, BlogCategoryRef } from "@/types/blog";

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getPrimaryBlogCategory(post: BlogPost): BlogCategoryRef | null {
  return post.primaryCategory || post.categories[0] || null;
}

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

export function getRelatedBlogPosts(
  currentPost: BlogPost,
  limit = 3
): BlogPost[] {
  const currentPrimaryCategory = currentPost.primaryCategory?.slug;

  return BLOG_POSTS.filter((post) => post.slug !== currentPost.slug)
    .sort((left, right) => {
      const leftMatchesPrimary =
        currentPrimaryCategory &&
        left.primaryCategory?.slug === currentPrimaryCategory;
      const rightMatchesPrimary =
        currentPrimaryCategory &&
        right.primaryCategory?.slug === currentPrimaryCategory;

      if (leftMatchesPrimary !== rightMatchesPrimary) {
        return leftMatchesPrimary ? -1 : 1;
      }

      return (
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime()
      );
    })
    .slice(0, limit);
}
