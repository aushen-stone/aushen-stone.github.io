"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { ACCESSORY_BRANDS } from "@/data/accessories";

const revealUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const ACCESSORY_STORY_PILLARS = [
  {
    title: "Protect",
    body: "Chemforce covers the after-care layer: sealing, enhancing, and cleaning stone once the material has already been chosen.",
  },
  {
    title: "Integrate",
    body: "HIDE solves the utility points that can break a finished surface if skimmer lids, drains, or access covers are treated as afterthoughts.",
  },
  {
    title: "Define",
    body: "FormBoss shapes edges, beds, planters, and transitions so the landscape around the paving reads as one system.",
  },
];

export function AccessoriesIndexPageClient() {
  return (
    <main className="min-h-screen bg-[#F6F2EC] text-[#1B1D1A] selection:bg-[#1B1D1A] selection:text-white">
      <section className="relative min-h-[calc(100svh-var(--nav-h-expanded))] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://info.skimmerlids.com.au/hubfs/Access-Cover-1-1.jpg"
            alt="Landscape project with integrated service cover."
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.82)_0%,rgba(12,12,12,0.54)_40%,rgba(12,12,12,0.22)_100%)]" />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.22]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[calc(100svh-var(--nav-h-expanded))] items-end page-padding-x pb-16 pt-12 sm:pb-20 md:pb-24">
          <div className="mx-auto grid w-full max-w-[1600px] gap-12 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <motion.div variants={revealUp} initial="hidden" animate="visible" className="max-w-4xl">
              <span className="inline-flex border border-white/18 bg-white/8 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-white/72 backdrop-blur-sm">
                Products / Accessories
              </span>
              <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-white/48">
                Aushen Stone
              </p>
              <h1 className="mt-3 font-serif text-[clamp(2.9rem,7.8vw,6.6rem)] leading-[0.9] tracking-tight text-white">
                The systems that make a stone project feel finished.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/72 md:text-[17px]">
                Stone is only part of the job. Sealers, skimmer lids, covers, edging, and planter systems all shape the final result, so we are treating accessories as their own first-class catalogue instead of hiding them inside the stone grid.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center gap-3 bg-white px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#171915] transition-colors hover:bg-[#DDE3D3]"
                >
                  Start an Accessories Enquiry
                  <ArrowUpRight size={16} />
                </Link>
                <a
                  href="tel:+61430799906"
                  className="inline-flex items-center justify-center gap-3 border border-white/18 bg-white/7 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/14"
                >
                  Call 0430 799 906
                  <ArrowUpRight size={16} />
                </a>
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
                Featured Brands
              </p>
              {ACCESSORY_BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={brand.route}
                  className="group flex items-center justify-between border-t border-white/12 pt-4 text-sm leading-7 first:border-t-0 first:pt-0"
                >
                  <div>
                    <p className="font-serif text-2xl text-white">{brand.name}</p>
                    <p className="text-white/52">{brand.summary}</p>
                  </div>
                  <MoveRight
                    size={18}
                    className="shrink-0 text-white/48 transition-transform group-hover:translate-x-1 group-hover:text-white"
                  />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1B1D1A]/10 bg-[#F6F2EC] page-padding-x py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#1B1D1A]/42">
              Accessory Structure
            </span>
            <h2 className="mt-3 font-serif text-[clamp(2.1rem,4.6vw,4.7rem)] leading-[0.95]">
              Three brands, three different jobs in the project stack.
            </h2>
            <p className="mt-6 max-w-3xl text-[15px] leading-8 text-[#1B1D1A]/68 md:text-[17px]">
              These pages are deliberately brand-led. Chemforce is about care and protection, HIDE is about integrated access, and FormBoss is about landscape structure. Each page is organised to make the range easier to understand and easier to specify.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-px bg-[#1B1D1A]/10 md:grid-cols-3">
            {ACCESSORY_STORY_PILLARS.map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={revealUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="bg-[#F6F2EC] p-7 sm:p-8"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#1B1D1A]/42">
                  {pillar.title}
                </p>
                <p className="mt-4 font-serif text-3xl leading-none text-[#1B1D1A]">
                  {pillar.title}
                </p>
                <p className="mt-5 text-sm leading-7 text-[#1B1D1A]/68">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1B1D1A]/10">
        {ACCESSORY_BRANDS.map((brand, index) => (
          <motion.div
            key={brand.slug}
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className={`page-padding-x py-16 sm:py-20 md:py-24 ${
              index % 2 === 0 ? "bg-white/38" : "bg-[#E8E1D8]"
            }`}
          >
            <div className="mx-auto grid max-w-[1600px] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={brand.coverImage.src}
                    alt={brand.coverImage.alt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    style={{ objectPosition: brand.coverImage.focalPoint ?? "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent" />
                </div>
              </div>

              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#1B1D1A]/42">
                  Brand 0{index + 1}
                </p>
                <h2 className="mt-3 font-serif text-[clamp(2.2rem,4vw,4.6rem)] leading-[0.95]">
                  {brand.name}
                </h2>
                <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[#1B1D1A]/68 md:text-[17px]">
                  {brand.summary}
                </p>
                <div className="mt-8 grid gap-px bg-[#1B1D1A]/10">
                  {brand.families.slice(0, 3).map((family) => (
                    <div
                      key={family.slug}
                      className="bg-[#F6F2EC] px-5 py-4 text-sm leading-7 text-[#1B1D1A]/72"
                    >
                      <span className="font-medium text-[#1B1D1A]">{family.name}</span>
                      {" — "}
                      {family.summary}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={brand.route}
                    className="inline-flex items-center justify-center gap-3 bg-[#1B1D1A] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#F6F2EC] transition-colors hover:bg-[#3B4034]"
                  >
                    View {brand.name}
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href="/contact/"
                    className="inline-flex items-center justify-center gap-3 border border-[#1B1D1A]/12 bg-white/55 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#1B1D1A] transition-colors hover:border-[#1B1D1A] hover:bg-white"
                  >
                    Ask Aushen
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
              Enquiry
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.3rem,4.5vw,4.8rem)] leading-[0.93] text-white">
              Already know the stone? We can help with the supporting system.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/62 md:text-[17px]">
              If you already have a paving or pool brief, we can use that to point you toward the right accessory family instead of making you guess from a long supplier catalogue.
            </p>
          </motion.div>
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center gap-3 bg-white px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#171915] transition-colors hover:bg-[#DDE3D3]"
            >
              Contact Aushen
              <ArrowUpRight size={16} />
            </Link>
            <a
              href="tel:+61430799906"
              className="inline-flex items-center justify-center gap-3 border border-white/18 bg-white/7 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/14"
            >
              Call 0430 799 906
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
