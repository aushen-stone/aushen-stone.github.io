import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HOME_SEO_CONTENT } from "@/data/pageSeoContent";
import { FaqSection } from "@/app/components/FaqSection";

export function HomeSeoIntro() {
  return (
    <section className="bg-[#F8F5F1] page-padding-x py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Aushen Stone</p>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.98] text-[#1a1c18]">
            Natural stone suppliers for every project.
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[#666d62] sm:text-base sm:leading-8">
            {HOME_SEO_CONTENT.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl leading-tight text-[#1a1c18]">Why choose Aushen Stone as your landscaping stone suppliers?</h2>
          <ul className="mt-8 border-t border-[#d8d0c4]">
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

export function HomeSeoDetails() {
  return (
    <>
      <section className="bg-[#F8F5F1] page-padding-x py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Materials and applications</p>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.4rem)] leading-tight text-[#1a1c18]">Explore our natural stone range.</h2>
            <p className="mt-6 text-base leading-8 text-[#666d62]">Natural stone combines strength with individual colour, texture and character. Our team can help compare slip resistance, finish, maintenance and intended use so the selected material performs as beautifully as it looks.</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-[#d8d0c4] bg-[#d8d0c4] sm:grid-cols-2">
            {HOME_SEO_CONTENT.range.map((item) => (
              <Link key={item.title} href={item.href} className="group bg-[#F8F5F1] p-7 transition-colors hover:bg-white sm:p-10">
                <h3 className="font-serif text-2xl text-[#1a1c18]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#666d62]">{item.text}</p>
                <span className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[#1a1c18]">Explore range <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FaqSection faqs={HOME_SEO_CONTENT.faqs} />
      <section className="bg-[#F8F5F1] page-padding-x pb-24">
        <div className="mx-auto grid max-w-[1400px] gap-px overflow-hidden border border-[#d8d0c4] bg-[#d8d0c4] md:grid-cols-2">
          <div className="bg-white p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#73796f]">Customer care</p>
            <h2 className="mt-3 font-serif text-3xl text-[#1a1c18]">Warranty &amp; returns</h2>
            <p className="mt-5 text-sm leading-7 text-[#666d62]">Please inspect goods on delivery and notify us promptly of visible damage, shortages or discrepancies. Requests are assessed under Australian Consumer Law and Aushen Stone policies, with an appropriate resolution provided where applicable.</p>
            <Link href="/terms-condition/" className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#1a1c18]">View terms <ArrowRight size={13} /></Link>
          </div>
          <div className="bg-white p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#73796f]">Order support</p>
            <h2 className="mt-3 font-serif text-3xl text-[#1a1c18]">Shipping &amp; delivery</h2>
            <p className="mt-5 text-sm leading-7 text-[#666d62]">We coordinate stone delivery across Melbourne and Australia through Aushen Stone or authorised carriers. Delivery dates are estimates, larger orders may arrive in instalments, and visible damage or shortages should be reported within three days.</p>
            <Link href="/contact/" className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#1a1c18]">Discuss delivery <ArrowRight size={13} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
