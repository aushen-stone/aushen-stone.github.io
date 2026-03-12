/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MoveDown } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { BlogCard } from "@/app/components/blog/BlogCard";
import { formatBlogDate, formatReadingTime } from "@/lib/blog";
import type { BlogCategory, BlogPostPreview } from "@/types/blog";

type BlogPageClientProps = {
  posts: BlogPostPreview[];
  categories: BlogCategory[];
};

export default function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const activeCategoryMeta = useMemo(() => {
    if (activeCategory === "all") {
      return null;
    }

    return categories.find((category) => category.slug === activeCategory) || null;
  }, [activeCategory, categories]);

  const activePosts = useMemo(() => {
    if (activeCategory === "all") {
      return posts;
    }

    return posts.filter((post) => post.primaryCategory?.slug === activeCategory);
  }, [activeCategory, posts]);

  const featuredPost = activePosts[0] || null;
  const gridPosts = activePosts.slice(1);
  const featuredLabel =
    activeCategory === "all"
      ? "Featured Story"
      : `Latest in ${activeCategoryMeta?.name || "Selected Topic"}`;
  const featuredCtaLabel =
    activeCategory === "all" ? "Read Featured Article" : "Read Latest Article";
  const resultsLabel =
    activeCategory === "all"
      ? "All blog articles"
      : `${activeCategoryMeta?.name || "Selected topic"} articles`;

  return (
    <main className="min-h-screen bg-[#F8F5F1]">
      <section className="relative overflow-hidden bg-[#1a1c18] pt-36 sm:pt-40 md:pt-44 pb-24 sm:pb-28 page-padding-x">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
          }}
        />
        <div className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-l from-[#2d3129] to-transparent opacity-50 pointer-events-none" />

        <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <span className="mb-6 block text-[10px] uppercase tracking-[0.32em] text-white/40">
              Material Thinking
            </span>
            <h1 className="font-serif text-[clamp(2.4rem,8vw,6.8rem)] leading-[0.86] tracking-tight text-[#F8F5F1]">
              The Stone <br />
              <span className="italic text-white/30">Blog</span>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-8 md:items-end">
            <p className="max-w-sm text-sm leading-relaxed text-white/60 md:text-right">
              Materials guidance, poolside know-how, and outdoor design thinking from the
              Aushen team.
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/30">
              Explore
              <MoveDown size={14} />
            </div>
          </div>
        </div>
      </section>

      {featuredPost ? (
        <section className="page-padding-x py-8 sm:py-10 md:py-12">
          <div className="mx-auto grid max-w-[1600px] gap-8 border border-[#ddd7cd] bg-white/75 p-4 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:p-8">
            <div className="relative overflow-hidden bg-[linear-gradient(180deg,#e8e0d1_0%,#cbbda8_100%)] min-h-[18rem]">
              {featuredPost.heroImageUrl ? (
                <img
                  src={featuredPost.heroImageUrl}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div>
                <span className="inline-flex rounded-full border border-[#1a1c18]/10 bg-[#f7f2ea] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#5c6353]">
                  {featuredLabel}
                </span>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">
                  <span>{featuredPost.primaryCategory?.name || "Aushen Blog"}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatBlogDate(featuredPost.publishedAt)}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatReadingTime(featuredPost.readingTimeMinutes)}</span>
                </div>
                <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[0.94] text-[#1a1c18]">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#555b50]">
                  {featuredPost.excerpt}
                </p>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex w-full items-center justify-center gap-3 bg-[#1a1c18] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#F8F5F1] transition-colors hover:bg-[#3B4034] sm:w-auto"
              >
                {featuredCtaLabel}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-padding-x pb-16 sm:pb-20 md:pb-28">
        <div className="mx-auto max-w-[1600px]">
          <div
            className="border-y border-[#ddd7cd] bg-white/55 px-4 py-5 sm:px-6"
            aria-labelledby="blog-filter-heading"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span
                  id="blog-filter-heading"
                  className="text-[10px] uppercase tracking-[0.18em] text-gray-500"
                >
                  Browse by Topic
                </span>
                <span className="hidden h-px w-10 bg-[#1a1c18]/10 sm:block" />
              </div>

              <div
                className="hide-scrollbar flex gap-2 overflow-x-auto pb-1"
                role="group"
                aria-labelledby="blog-filter-heading"
              >
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  aria-pressed={activeCategory === "all"}
                  aria-controls="blog-results"
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all ${
                    activeCategory === "all"
                      ? "border-[#1a1c18] bg-[#1a1c18] text-white"
                      : "border-[#ddd7cd] bg-transparent text-gray-500 hover:border-[#bfb5a5] hover:text-[#1a1c18]"
                  }`}
                >
                  All Articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setActiveCategory(category.slug)}
                    aria-pressed={activeCategory === category.slug}
                    aria-controls="blog-results"
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all ${
                      activeCategory === category.slug
                        ? "border-[#1a1c18] bg-[#1a1c18] text-white"
                        : "border-[#ddd7cd] bg-transparent text-gray-500 hover:border-[#bfb5a5] hover:text-[#1a1c18]"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section
            id="blog-results"
            aria-labelledby="blog-results-heading"
            aria-live="polite"
          >
            <h2 id="blog-results-heading" className="sr-only">
              {resultsLabel}
            </h2>

            {featuredPost ? (
              gridPosts.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {gridPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : null
            ) : (
              <div className="mt-10 border border-[#ddd7cd] bg-white/75 px-6 py-14 text-center">
                <p className="font-serif text-3xl text-[#1a1c18]">No articles in this topic yet</p>
                <p className="mt-4 text-sm text-[#5b6255]">
                  Switch back to all articles to keep exploring the library.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className="mt-6 inline-flex items-center justify-center border border-[#1a1c18]/15 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-[#1a1c18] transition-colors hover:border-[#1a1c18]/30"
                >
                  View All Articles
                </button>
              </div>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
