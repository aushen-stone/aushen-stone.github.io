import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/app/components/Footer";
import {
  TERMS_CONDITIONS_DESCRIPTION,
  TERMS_CONDITIONS_SECTIONS,
  TERMS_CONDITIONS_TITLE,
  type LegalListItem,
} from "@/data/legal/terms";
import { buildMetadata } from "@/lib/seo";

const TERMS_CONDITIONS_PATH = "/terms-condition/";

export const metadata: Metadata = buildMetadata({
  title: `${TERMS_CONDITIONS_TITLE} | Aushen Stone`,
  description: TERMS_CONDITIONS_DESCRIPTION,
  path: TERMS_CONDITIONS_PATH,
});

function LegalList({
  items,
  depth = 0,
}: {
  items: readonly LegalListItem[];
  depth?: number;
}) {
  const listClassName =
    depth === 0
      ? "list-disc"
      : depth === 1
        ? "list-[circle]"
        : "list-[square]";

  return (
    <ul className={`${listClassName} space-y-3 pl-5 text-sm leading-7 text-[#3e4337] sm:text-[0.98rem]`}>
      {items.map((item, index) => (
        <li key={`${depth}-${index}-${item.text.slice(0, 24)}`}>
          <span>{item.text}</span>
          {item.items ? (
            <div className="mt-3">
              <LegalList items={item.items} depth={depth + 1} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function TermsConditionPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#1a1c18] selection:bg-[#1a1c18] selection:text-white">
      <section className="border-b border-[#d7d0c5] bg-[linear-gradient(180deg,#f6f1e9_0%,#f8f5f1_100%)] pt-28 sm:pt-32 md:pt-36">
        <div className="page-padding-x pb-14 sm:pb-16 md:pb-20">
          <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="max-w-4xl">
              <span className="mb-5 inline-flex rounded-full border border-[#1a1c18]/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#5a604f]">
                Legal
              </span>
              <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight">
                {TERMS_CONDITIONS_TITLE}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#4f5546] sm:text-base">
                These terms govern the supply of goods and services by AUSHEN.
                Use the clause index below to jump directly to a section, or read
                the full document in sequence.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#1a1c18]/10 bg-white/70 p-6 backdrop-blur-sm">
              <div className="space-y-3 text-sm text-[#4f5546]">
                <p className="font-serif text-2xl text-[#1a1c18]">
                  {TERMS_CONDITIONS_SECTIONS.length} clauses
                </p>
                <p>
                  Structured for direct reading, anchor linking, and search engine
                  indexing.
                </p>
                <p>
                  Questions about these terms can be directed through the{" "}
                  <Link
                    href="/contact"
                    className="text-[#1a1c18] underline decoration-[#1a1c18]/30 underline-offset-4 transition-colors hover:text-[#3b4034]"
                  >
                    contact page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-padding-x py-12 sm:py-16 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-16">
          <aside className="lg:min-w-0">
            <div
              id="terms-index"
              className="rounded-[1.5rem] border border-[#1a1c18]/10 bg-white/80 p-6 lg:sticky lg:top-[calc(var(--content-sticky-top)+1.5rem)] lg:max-h-[calc(100vh-var(--content-sticky-top)-3rem)] lg:overflow-y-auto"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#6b715f]">
                Clause Index
              </p>
              <ol className="mt-4 space-y-3 text-sm text-[#4f5546]">
                {TERMS_CONDITIONS_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-start gap-3 rounded-md transition-colors hover:text-[#1a1c18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                    >
                      <span className="font-serif text-[#1a1c18]/45 transition-colors group-hover:text-[#1a1c18]">
                        {String(section.number).padStart(2, "0")}
                      </span>
                      <span className="leading-6">{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="rounded-[2rem] border border-[#1a1c18]/10 bg-white/80 p-6 sm:p-8 md:p-12">
            <div className="space-y-10 sm:space-y-12">
              {TERMS_CONDITIONS_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 border-t border-[#d9d3c9] pt-8 first:border-t-0 first:pt-0 md:scroll-mt-36"
                >
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                    <h2 className="font-serif text-[clamp(1.5rem,2.4vw,2.3rem)] leading-tight text-[#1a1c18]">
                      <span className="mr-3 text-[#7b725f]">
                        {String(section.number).padStart(2, "0")}
                      </span>
                      {section.title}
                    </h2>
                    <a
                      href="#terms-index"
                      className="text-[11px] uppercase tracking-[0.18em] text-[#6b715f] transition-colors hover:text-[#1a1c18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Back to index
                    </a>
                  </div>
                  <LegalList items={section.items} />
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
