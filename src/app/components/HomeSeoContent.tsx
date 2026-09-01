import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HOME_SEO_CONTENT } from "@/data/pageSeoContent";
import { FaqSection } from "@/app/components/FaqSection";

export function HomeReasonsSection() {
  return (
    <section className="bg-[#F8F5F1] page-padding-x py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-5xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Why Aushen</p>
          <h2 className="font-serif text-3xl leading-tight text-[#1a1c18]">Why Choose Aushen Stone As Your Landscaping Stone Suppliers?</h2>
          <ul className="mt-8 grid border-t border-[#d8d0c4] md:grid-cols-2 md:gap-x-12">
            {HOME_SEO_CONTENT.reasons.map((reason) => (
              <li key={reason} className="flex gap-4 border-b border-[#d8d0c4] py-4 text-sm leading-6 text-[#555d53]">
                <Check aria-hidden="true" size={16} className="mt-1 shrink-0 text-[#8b6f35]" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HomeNaturalStoneSuppliersSection() {
  const content = HOME_SEO_CONTENT.naturalStoneSuppliers;

  return (
    <section className="bg-white page-padding-x py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-10 border-t border-[#d8d0c4] pt-12 sm:gap-14 sm:pt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Natural stone</p>
          <h2 className="mt-4 max-w-xl font-serif text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.05] text-[#1a1c18]">
            {content.title}
          </h2>
        </div>
        <div className="space-y-6 text-sm leading-7 text-[#666d62] sm:text-base sm:leading-8">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeExploreNaturalStoneRangeSection() {
  const content = HOME_SEO_CONTENT.exploreNaturalStoneRange;

  return (
    <section className="bg-[#F8F5F1] page-padding-x py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Products by application</p>
          <h2 className="mt-4 font-serif text-[clamp(2.25rem,5vw,4.4rem)] leading-tight text-[#1a1c18]">
            {content.title}
          </h2>
          <p className="mt-6 text-base leading-8 text-[#666d62]">{content.introduction}</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-[#d8d0c4] bg-[#d8d0c4] sm:grid-cols-2">
          {content.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex min-h-64 flex-col bg-white p-7 transition-colors hover:bg-[#FCFAF7] sm:p-10"
            >
              <h3 className="font-serif text-2xl text-[#1a1c18] sm:text-3xl">{item.title}</h3>
              <p className="mt-5 text-sm leading-7 text-[#666d62]">{item.description}</p>
              <span className="mt-auto inline-flex items-center gap-3 pt-8 text-[10px] uppercase tracking-[0.18em] text-[#1a1c18]">
                Explore products
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSeoDetails() {
  return (
    <>
      <FaqSection faqs={HOME_SEO_CONTENT.faqs} />
      <section className="bg-[#F8F5F1] page-padding-x pb-24">
        <div className="mx-auto grid max-w-[1400px] gap-px overflow-hidden border border-[#d8d0c4] bg-[#d8d0c4] md:grid-cols-2">
          <div className="bg-white p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#73796f]">Customer care</p>
            <h2 className="mt-3 font-serif text-3xl text-[#1a1c18]">Warranty &amp; Returns</h2>
            <p className="mt-5 text-sm leading-7 text-[#666d62]">Please inspect goods on delivery and notify us promptly of visible damage, shortages or discrepancies. Requests are assessed under Australian Consumer Law and Aushen Stone policies, with an appropriate resolution provided where applicable.</p>
            <Link href="/terms-condition/" className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#1a1c18]">View terms <ArrowRight size={13} /></Link>
          </div>
          <div className="bg-white p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#73796f]">Order support</p>
            <h2 className="mt-3 font-serif text-3xl text-[#1a1c18]">Shipping &amp; Delivery</h2>
            <p className="mt-5 text-sm leading-7 text-[#666d62]">We coordinate stone delivery across Melbourne and Australia through Aushen Stone or authorised carriers. Delivery dates are estimates, larger orders may arrive in instalments, and visible damage or shortages should be reported within three days.</p>
            <Link href="/contact/" className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#1a1c18]">Discuss delivery <ArrowRight size={13} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
