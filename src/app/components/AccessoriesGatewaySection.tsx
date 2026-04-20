import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ACCESSORY_BRANDS } from "@/data/accessories";
import type { AccessoryBrandSlug } from "@/types/accessory";

const HOME_ACCESSORY_POSITIONS: Record<
  AccessoryBrandSlug,
  {
    eyebrow: string;
    blurb: string;
    note: string;
  }
> = {
  chemforce: {
    eyebrow: "Stone care",
    blurb: "Sealers, enhancers, and cleaners for protecting and maintaining finished surfaces.",
    note: "Protection, enhancement, and remedial cleaning",
  },
  hide: {
    eyebrow: "Access covers",
    blurb: "Flush lids and covers that sit back into paving, tile, and pool surrounds.",
    note: "Tile-in, paved, and recessed cover systems",
  },
  formboss: {
    eyebrow: "Edging systems",
    blurb: "Steel edging and support details that sharpen the transition into landscape.",
    note: "Garden edging, planters, and install hardware",
  },
};

export function AccessoriesGatewaySection() {
  return (
    <section className="border-y border-[#1A1C18]/10 bg-[#F3ECE2] text-[#171915]">
      <div className="mx-auto grid max-w-[1480px] gap-10 page-padding-x py-16 sm:py-18 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#171915]/42">
            Accessories
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.8rem)] leading-[0.96] text-[#171915]">
            The finishing pieces behind the stone.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-8 text-[#171915]/68 md:text-[17px]">
            From sealing and maintenance to flush access covers and edge restraint,
            these are the supporting systems we pair with stone projects.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/accessories/"
              className="inline-flex items-center justify-center gap-3 bg-[#171915] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#F6F2EC] transition-colors hover:bg-[#31362C]"
            >
              Explore Accessories
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center gap-3 border border-[#171915]/14 bg-white/60 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#171915] transition-colors hover:border-[#171915] hover:bg-white"
            >
              Talk to Us
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {ACCESSORY_BRANDS.map((brand) => {
            const position = HOME_ACCESSORY_POSITIONS[brand.slug];

            return (
              <Link
                key={brand.slug}
                href={brand.route}
                className="group rounded-[1.5rem] border border-[#171915]/10 bg-white/55 p-5 transition-colors hover:border-[#171915]/22 hover:bg-white sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#171915]/48">
                      {position.eyebrow}
                    </p>
                    <h3 className="mt-2 font-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-[0.96] text-[#171915]">
                      {brand.name}
                    </h3>
                  </div>

                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#171915]/10 text-[#171915]/58 transition-colors group-hover:border-[#171915]/20 group-hover:text-[#171915]">
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#171915]/70">
                  {position.blurb}
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#171915]/46">
                  {position.note}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
