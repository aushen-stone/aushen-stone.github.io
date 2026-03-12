import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailPage from "./BlogDetailPage";
import { BLOG_POSTS } from "@/data/blog.generated";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

type BlogDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found | Aushen Stone",
      description: "The requested article is not available.",
      path: `/blog/${slug}/`,
      index: false,
      follow: false,
    });
  }

  return buildMetadata({
    title: `${post.seoTitle || post.title} | Blog | Aushen Stone`,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}/`,
    index: true,
    follow: true,
  });
}

export default async function BlogDetailRoute({
  params,
}: BlogDetailRouteProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogDetailPage
      post={post}
      relatedPosts={getRelatedBlogPosts(post)}
    />
  );
}
