/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatBlogDate, formatReadingTime } from "@/lib/blog";
import type { BlogPostPreview } from "@/types/blog";

type BlogCardProps = {
  post: BlogPostPreview;
  compact?: boolean;
};

export function BlogCard({ post, compact = false }: BlogCardProps) {
  const categoryLabel = post.primaryCategory?.name || post.categories[0]?.name || "Aushen Blog";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden border border-[#ddd7cd] bg-white/85 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9c0b2] hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F5F1]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#e7e2d7_0%,#cfc5b3_100%)]">
        {post.heroImageUrl ? (
          <img
            src={post.heroImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/65 via-black/28 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
          <span className="rounded-full border border-white/12 bg-[#1a1c18]/82 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#F8F5F1] shadow-[0_8px_18px_-12px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className={compact ? "p-4 sm:p-5" : "p-5 sm:p-6"}>
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span aria-hidden="true">•</span>
          <span>{formatReadingTime(post.readingTimeMinutes)}</span>
        </div>

        <h3
          className={`mt-3 font-serif leading-tight text-[#1a1c18] ${
            compact ? "text-[1.35rem]" : "text-[clamp(1.35rem,2.2vw,1.8rem)]"
          }`}
        >
          {post.title}
        </h3>

        <p className="text-clamp-2 mt-3 text-sm leading-6 text-[#555b50]">
          {post.excerpt}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#1a1c18]">
          Read Article
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
