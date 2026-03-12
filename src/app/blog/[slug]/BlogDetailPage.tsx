/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { BlogCard } from "@/app/components/blog/BlogCard";
import { formatBlogDate, formatReadingTime } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

type BlogDetailPageProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

export default function BlogDetailPage({
  post,
  relatedPosts,
}: BlogDetailPageProps) {
  const tocEntries = post.headings;
  const showToc = tocEntries.length >= 2;

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#1a1c18]">
      <section className="border-b border-[#ddd7cd] bg-[linear-gradient(180deg,#f4eee5_0%,#f8f5f1_100%)] pt-28 sm:pt-32 md:pt-36 page-padding-x">
        <div className="mx-auto grid max-w-[1600px] gap-8 pb-10 sm:pb-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#5e6457] transition-colors hover:text-[#1a1c18]"
            >
              <ArrowLeft size={14} />
              Back to Blog
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">
              <span>{post.primaryCategory?.name || "Aushen Blog"}</span>
              <span aria-hidden="true">•</span>
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span aria-hidden="true">•</span>
              <span>{formatReadingTime(post.readingTimeMinutes)}</span>
            </div>

            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.3rem,5.4vw,5.6rem)] leading-[0.92] tracking-tight">
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#555b50]">
              {post.excerpt}
            </p>
          </div>

          <div className="overflow-hidden border border-[#ddd7cd] bg-[linear-gradient(180deg,#e7e0d3_0%,#c8baa4_100%)]">
            {post.heroImageUrl ? (
              <img
                src={post.heroImageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-padding-x py-10 sm:py-12 md:py-16">
        <div className="mx-auto grid max-w-[1260px] gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12 xl:grid-cols-[minmax(0,52rem)_18rem] xl:justify-between">
          <article className="min-w-0 lg:max-w-[48rem]">
            <div className="border border-[#ddd7cd] bg-white/80 p-6 sm:p-8 md:p-10 lg:p-12">
              <div
                className="blog-richtext"
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
              />
            </div>
          </article>

          <aside className="lg:justify-self-end">
            <div className="space-y-5 lg:sticky lg:top-[calc(var(--content-sticky-top)+1rem)]">
              <div className="border border-[#ddd7cd] bg-white/85 p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">Article Info</p>
                <div className="mt-4 space-y-4 text-sm text-[#555b50]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">
                      Published
                    </p>
                    <p className="mt-1">{formatBlogDate(post.publishedAt)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">
                      Category
                    </p>
                    <p className="mt-1">{post.primaryCategory?.name || "Aushen Blog"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">
                      Reading Time
                    </p>
                    <p className="mt-1">{formatReadingTime(post.readingTimeMinutes)}</p>
                  </div>
                </div>
              </div>

              {showToc ? (
                <div className="border border-[#ddd7cd] bg-white/85 p-5 sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    On This Page
                  </p>
                  <ol className="mt-4 space-y-3">
                    {tocEntries.map((heading) => (
                      <li
                        key={heading.id}
                        className={heading.level === 3 ? "pl-4" : ""}
                      >
                        <a
                          href={`#${heading.id}`}
                          className={`block leading-6 transition-colors hover:text-[#1a1c18] ${
                            heading.level === 3
                              ? "text-[0.82rem] text-[#73796f]"
                              : "text-sm text-[#555b50]"
                          }`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <div className="border border-[#ddd7cd] bg-[#1a1c18] p-5 text-[#F8F5F1] sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Next Step
                </p>
                <h2 className="mt-4 font-serif text-2xl leading-tight">
                  Need help choosing the right stone?
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Browse product options or speak with the Aushen team about your project.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center border border-white/20 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#1a1c18]"
                  >
                    Browse Products
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center bg-[#F0F2E4] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#1a1c18] transition-colors hover:bg-white"
                  >
                    Talk to Aushen
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="page-padding-x pb-16 sm:pb-20 md:pb-28">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-8 flex flex-col gap-3 border-t border-[#ddd7cd] pt-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Continue Reading
                </span>
                <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,3.4rem)] leading-[0.96] text-[#1a1c18]">
                  Related Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#1a1c18] transition-colors hover:text-[#3B4034]"
              >
                View all articles
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
