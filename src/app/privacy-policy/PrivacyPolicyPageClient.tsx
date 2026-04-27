"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Footer } from "@/app/components/Footer";
import { CONTACT_INFO } from "@/data/contact";
import {
  PRIVACY_POLICY_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_SUMMARY,
  PRIVACY_POLICY_TITLE,
} from "@/data/legal/privacy";
import type { LegalListItem } from "@/data/legal/terms";

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
    <ul
      className={`${listClassName} space-y-3 pl-5 text-sm leading-7 text-[#3e4337] sm:text-[0.98rem]`}
    >
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

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const summaryVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PrivacyPolicyPageClient() {
  const [activeId, setActiveId] = useState<string>(
    PRIVACY_POLICY_SECTIONS[0]?.id ?? "",
  );
  const activeSection =
    PRIVACY_POLICY_SECTIONS.find((section) => section.id === activeId) ??
    PRIVACY_POLICY_SECTIONS[0];

  useEffect(() => {
    const sections = PRIVACY_POLICY_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const readHash = () => window.location.hash.replace(/^#/, "");
    let frameId: number | null = null;

    const getActivationOffset = () => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const stickyTopRem = parseFloat(
        rootStyles.getPropertyValue("--content-sticky-top"),
      );
      const rootFontSize = parseFloat(rootStyles.fontSize) || 16;
      const stickyTopPx = Number.isFinite(stickyTopRem)
        ? stickyTopRem * rootFontSize
        : 96;

      return stickyTopPx + 56;
    };

    const updateActiveSection = () => {
      const activationOffset = getActivationOffset();
      let nextActiveId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationOffset) {
          nextActiveId = section.id;
          continue;
        }

        break;
      }

      const isNearPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 24;

      if (isNearPageBottom) {
        nextActiveId = sections[sections.length - 1].id;
      }

      setActiveId((currentId) =>
        currentId === nextActiveId ? currentId : nextActiveId,
      );
    };

    const requestSync = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    const syncFromHash = () => {
      const hashId = readHash();
      if (hashId && sections.some((section) => section.id === hashId)) {
        setActiveId(hashId);
        return;
      }

      requestSync();
    };

    syncFromHash();

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#1a1c18] selection:bg-[#1a1c18] selection:text-white">
      <section className="relative isolate overflow-hidden bg-[#171a16] text-white">
        <div className="absolute inset-0 bg-[url('/product-photos/blueocean-01.webp')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,26,22,0.96)_0%,rgba(23,26,22,0.78)_48%,rgba(23,26,22,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(248,245,241,0)_0%,#F8F5F1_100%)]" />

        <div className="page-padding-x relative pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              className="max-w-4xl"
            >
              <span className="mb-5 inline-flex border border-white/25 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/70">
                Legal
              </span>
              <h1 className="font-serif text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.9]">
                {PRIVACY_POLICY_TITLE}
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                A clear account of how Aushen Stone handles personal information
                from website enquiries, showroom conversations, sample requests,
                quotes, orders, and project support.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.16 } },
              }}
              className="mt-12 grid gap-6 border-t border-white/20 pt-6 sm:grid-cols-3"
            >
              <motion.div variants={summaryVariants}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                  Last Updated
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight">
                  {PRIVACY_POLICY_LAST_UPDATED}
                </p>
              </motion.div>
              {PRIVACY_POLICY_SUMMARY.slice(0, 2).map((item) => (
                <motion.div key={item.label} variants={summaryVariants}>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-padding-x py-12 sm:py-16 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start lg:gap-16">
          <aside className="lg:sticky lg:top-[calc(var(--content-sticky-top)+1.5rem)] lg:self-start">
            <nav
              id="privacy-index"
              aria-label="Privacy Policy Index"
              className="border-y border-[#1a1c18]/10 py-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#6b715f]">
                Policy Index
              </p>

              <div className="mt-5 border-l-2 border-[#1a1c18] pl-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7b725f]">
                  Reading Now
                </p>
                <p className="mt-2 font-serif text-lg leading-snug text-[#1a1c18]">
                  <span className="mr-2 text-[#7b725f]">
                    {String(activeSection.number).padStart(2, "0")}
                  </span>
                  {activeSection.title}
                </p>
              </div>

              <ol className="mt-6 space-y-1.5 text-sm text-[#4f5546]">
                {PRIVACY_POLICY_SECTIONS.map((section) => {
                  const isActive = section.id === activeId;

                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        aria-current={isActive ? "location" : undefined}
                        onClick={() => setActiveId(section.id)}
                        className={`group flex items-start gap-3 px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] ${
                          isActive
                            ? "bg-[#1a1c18] text-white"
                            : "hover:bg-[#ece5dc] hover:text-[#1a1c18]"
                        }`}
                      >
                        <span
                          className={`font-serif transition-colors ${
                            isActive
                              ? "text-white/65"
                              : "text-[#1a1c18]/45 group-hover:text-[#1a1c18]"
                          }`}
                        >
                          {String(section.number).padStart(2, "0")}
                        </span>
                        <span className="leading-6">{section.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          <article className="border border-[#1a1c18]/10 bg-white/80 p-6 sm:p-8 md:p-12">
            <div className="space-y-10 sm:space-y-12">
              {PRIVACY_POLICY_SECTIONS.map((section) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                      href="#privacy-index"
                      className="text-[11px] uppercase tracking-[0.18em] text-[#6b715f] transition-colors hover:text-[#1a1c18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Back to index
                    </a>
                  </div>
                  <LegalList items={section.items} />
                </motion.section>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="page-padding-x border-t border-[#d7d0c5] bg-[#efe9df] py-12 sm:py-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#6b715f]">
              Privacy Contact
            </p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,4rem)] leading-tight">
              Questions about your information?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4f5546] sm:text-base">
              Contact Aushen Stone for access, correction, privacy complaints,
              or any question about how your personal information is handled.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex items-center justify-center gap-3 bg-[#1a1c18] px-6 py-4 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3b4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe9df]"
            >
              <Mail size={16} />
              Email
            </a>
            <a
              href={CONTACT_INFO.landlineLink}
              className="inline-flex items-center justify-center gap-3 border border-[#1a1c18]/20 px-6 py-4 text-xs uppercase tracking-[0.18em] text-[#1a1c18] transition-colors hover:border-[#1a1c18] hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe9df]"
            >
              <Phone size={16} />
              Call
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 border border-[#1a1c18]/20 px-6 py-4 text-xs uppercase tracking-[0.18em] text-[#1a1c18] transition-colors hover:border-[#1a1c18] hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe9df]"
            >
              <ArrowRight size={16} />
              Contact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
