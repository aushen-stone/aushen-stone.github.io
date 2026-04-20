"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, MoveRight, PhoneCall } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import type { AccessoryBrand, AccessoryItem } from "@/types/accessory";

const revealUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const RESOURCE_KIND_LABELS = {
  official: "Product Details",
  guide: "Guide & Downloads",
  category: "Range Overview",
} as const;

function renderInternalOrExternalLink(
  href: string,
  children: ReactNode,
  className: string
) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      className={className}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function AccessoryAction({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary: boolean;
}) {
  const icon = href.startsWith("tel:") ? (
    <PhoneCall size={16} />
  ) : href.startsWith("/") ? (
    <ArrowUpRight size={16} />
  ) : (
    <ExternalLink size={16} />
  );

  return renderInternalOrExternalLink(
    href,
    <>
      <span>{label}</span>
      {icon}
    </>,
    primary
      ? "inline-flex items-center justify-center gap-3 bg-[var(--accessory-ink)] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[var(--accessory-surface)] transition-colors hover:bg-[var(--accessory-accent)]"
      : "inline-flex items-center justify-center gap-3 border border-[var(--accessory-border)] bg-white/55 px-6 py-4 text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-[var(--accessory-ink)] hover:bg-white"
  );
}

function ItemMetaList({
  label,
  values,
}: {
  label: string;
  values?: string[];
}) {
  if (!values?.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accessory-ink)]/45">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={`${label}-${value}`}
            className="border border-[var(--accessory-border)] px-3 py-1.5 text-xs text-[var(--accessory-ink)]/75"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function AccessoryItemRow({ item }: { item: AccessoryItem }) {
  return (
    <div className="grid gap-8 border-t border-[var(--accessory-border)] py-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl leading-tight text-[var(--accessory-ink)]">
              {item.name}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--accessory-ink)]/68">
              {item.summary}
            </p>
          </div>
          {item.sourceUrl ? (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[var(--accessory-ink)]/55 transition-colors hover:text-[var(--accessory-ink)]"
              aria-label={`Open source page for ${item.name}`}
            >
              <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
        {item.note ? (
          <p className="max-w-2xl border-l border-[var(--accessory-border)] pl-4 text-sm leading-7 text-[var(--accessory-ink)]/58">
            {item.note}
          </p>
        ) : null}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
        <ItemMetaList label="Pack Sizes" values={item.packSizes} />
        <ItemMetaList label="Sizes" values={item.sizes} />
        <ItemMetaList label="Depths" values={item.depths} />
        <ItemMetaList label="Finishes" values={item.finishes} />
        <ItemMetaList label="Colours" values={item.colors} />
      </div>
    </div>
  );
}

export function AccessoryBrandPageRenderer({ brand }: { brand: AccessoryBrand }) {
  const pageStyle = {
    "--accessory-surface": brand.palette.surface,
    "--accessory-ink": brand.palette.ink,
    "--accessory-accent": brand.palette.accent,
    "--accessory-accent-soft": brand.palette.accentSoft,
    "--accessory-border": brand.palette.border,
  } as CSSProperties;

  return (
    <main
      style={pageStyle}
      className="min-h-screen bg-[var(--accessory-surface)] text-[var(--accessory-ink)] selection:bg-[var(--accessory-ink)] selection:text-white"
    >
      <section className="relative min-h-[calc(100svh-var(--nav-h-expanded))] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={brand.hero.image.src}
            alt={brand.hero.image.alt}
            className="h-full w-full object-cover"
            style={{ objectPosition: brand.hero.image.focalPoint ?? "center" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.48)_42%,rgba(10,10,10,0.22)_100%)]" />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[calc(100svh-var(--nav-h-expanded))] items-end page-padding-x pb-16 pt-12 sm:pb-20 md:pb-24">
          <div className="mx-auto grid w-full max-w-[1600px] items-end gap-12 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
            <motion.div
              variants={revealUp}
              initial="hidden"
              animate="visible"
              className="max-w-4xl"
            >
              <span className="inline-flex border border-white/18 bg-white/8 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-white/72 backdrop-blur-sm">
                {brand.hero.eyebrow}
              </span>
              <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-white/52">
                {brand.name}
              </p>
              <h1 className="mt-3 max-w-4xl font-serif text-[clamp(2.8rem,7.8vw,6.4rem)] leading-[0.9] tracking-tight text-white">
                {brand.hero.headline}
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/72 md:text-[17px]">
                {brand.hero.body}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AccessoryAction
                  href={brand.hero.primaryCta.href}
                  label={brand.hero.primaryCta.label}
                  primary
                />
                <AccessoryAction
                  href={brand.hero.secondaryCta.href}
                  label={brand.hero.secondaryCta.label}
                  primary={false}
                />
              </div>
            </motion.div>

            <motion.div
              variants={revealUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.12 }}
              className="grid gap-4 self-end border border-white/14 bg-black/16 p-6 text-white/78 backdrop-blur-md"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/44">
                Quick View
              </p>
              <p className="text-sm leading-7">{brand.hero.ambientNote}</p>
              <div className="grid gap-4 border-t border-white/14 pt-5 sm:grid-cols-3 xl:grid-cols-1">
                {brand.stats.map((stat) => (
                  <div key={stat.label} className="space-y-1.5">
                    <p className="font-serif text-[1.85rem] leading-none text-white">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/46">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-padding-x py-16 sm:py-24 md:py-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8"
          >
            <div className="max-w-4xl">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--accessory-ink)]/42">
                Overview
              </span>
              <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,4.6vw,4.6rem)] leading-[0.94]">
                {brand.overview.heading}
              </h2>
              <p className="mt-6 max-w-3xl text-[15px] leading-8 text-[var(--accessory-ink)]/68 md:text-[17px]">
                {brand.overview.body}
              </p>
            </div>
            <div className="grid gap-px bg-[var(--accessory-border)] md:grid-cols-3">
              {brand.overview.bullets.map((bullet) => (
                <div key={bullet} className="bg-[var(--accessory-surface)] p-6 sm:p-7">
                  <p className="text-sm leading-7 text-[var(--accessory-ink)]/68">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-8 border border-[var(--accessory-border)] bg-white/48 p-7 sm:p-8 lg:sticky lg:top-[calc(var(--content-sticky-top)+1rem)]"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accessory-ink)]/45">
                Project Fit
              </p>
              <ul className="mt-5 space-y-4">
                {brand.projectApplications.map((application) => (
                  <li
                    key={application}
                    className="flex items-start gap-3 border-t border-[var(--accessory-border)] pt-4 text-sm leading-7 text-[var(--accessory-ink)]/68 first:border-t-0 first:pt-0"
                  >
                    <MoveRight
                      size={16}
                      className="mt-1 shrink-0 text-[var(--accessory-accent)]"
                    />
                    <span>{application}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-px bg-[var(--accessory-border)]">
              {brand.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="grid gap-2 bg-[var(--accessory-surface)] p-5"
                >
                  <p className="font-serif text-[1.9rem] leading-none text-[var(--accessory-ink)]">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accessory-ink)]/45">
                    {stat.label}
                  </p>
                  <p className="text-sm leading-6 text-[var(--accessory-ink)]/65">
                    {stat.supportingText}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="border-t border-[var(--accessory-border)]">
        {brand.families.map((family, index) => (
          <motion.div
            key={family.slug}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className={`page-padding-x py-16 sm:py-20 md:py-24 ${
              index % 2 === 0 ? "bg-white/36" : "bg-[var(--accessory-accent-soft)]"
            }`}
          >
            <div className="mx-auto grid max-w-[1600px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={family.image.src}
                    alt={family.image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    style={{ objectPosition: family.image.focalPoint ?? "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
                </div>
              </div>

              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--accessory-ink)]/42">
                  Family 0{index + 1}
                </span>
                <h2 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,4vw,4.1rem)] leading-[0.96]">
                  {family.name}
                </h2>
                <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[var(--accessory-ink)]/68 md:text-[17px]">
                  {family.summary}
                </p>
                <p className="mt-6 max-w-2xl border-l border-[var(--accessory-border)] pl-5 text-sm leading-8 text-[var(--accessory-ink)]/58">
                  {family.detail}
                </p>
                <div className="mt-8 grid gap-px bg-[var(--accessory-border)]">
                  {family.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="bg-[var(--accessory-surface)] px-5 py-4 text-sm leading-7 text-[var(--accessory-ink)]/70"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="page-padding-x py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="max-w-4xl"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--accessory-ink)]/42">
              Product Highlights
            </span>
            <h2 className="mt-3 font-serif text-[clamp(2.1rem,4.4vw,4.3rem)] leading-[0.95]">
              The main products and systems clients ask for most
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-8 text-[var(--accessory-ink)]/68 md:text-[17px]">
              This section gives a cleaner view of the products and systems most relevant to current stone, pool, and landscape enquiries, without making you dig through a supplier catalogue first.
            </p>
          </motion.div>

          <div className="mt-12 border-b border-[var(--accessory-border)]">
            {brand.coreItems.map((item) => (
              <AccessoryItemRow key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-padding-x border-t border-[var(--accessory-border)] bg-white/35 py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.14 }}
            className="max-w-4xl space-y-6"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--accessory-ink)]/42">
              Resources
            </span>
            <h2 className="font-serif text-[clamp(2rem,3.8vw,3.5rem)] leading-[0.98]">
              Downloads, range overviews, and brand references
            </h2>
            <p className="max-w-3xl text-[15px] leading-8 text-[var(--accessory-ink)]/68 md:text-[17px]">
              Use these links for product details, brand guides, and broader range information before you lock in the final specification.
            </p>
          </motion.div>

          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.14 }}
            className="mt-10 grid gap-px bg-[var(--accessory-border)] md:grid-cols-2"
          >
            {brand.resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="grid gap-4 bg-[var(--accessory-surface)] p-6 transition-colors hover:text-[var(--accessory-accent)] sm:p-7"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accessory-ink)]/42">
                    {RESOURCE_KIND_LABELS[resource.kind]}
                  </p>
                  <p className="mt-3 text-[17px] leading-7 text-[var(--accessory-ink)]/76">
                    {resource.label}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-sm">
                  Open Resource
                  <ExternalLink size={16} />
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#171915] py-16 text-[#F8F5F1] sm:py-24">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 page-padding-x lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="max-w-3xl"
          >
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
              Next Step
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.3rem,4.5vw,4.8rem)] leading-[0.93] text-white">
              {brand.cta.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/62 md:text-[17px]">
              {brand.cta.body}
            </p>
          </motion.div>
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <AccessoryAction
              href={brand.cta.primary.href}
              label={brand.cta.primary.label}
              primary
            />
            <AccessoryAction
              href={brand.cta.secondary.href}
              label={brand.cta.secondary.label}
              primary={false}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
