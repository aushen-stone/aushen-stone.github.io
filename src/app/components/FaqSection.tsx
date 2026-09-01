import type { PageFaq } from "@/data/pageSeoContent";

type FaqSectionProps = {
  faqs: readonly PageFaq[];
  eyebrow?: string;
  heading?: string;
};

export function FaqSection({ faqs, eyebrow = "Common questions", heading = "FAQs" }: FaqSectionProps) {
  return (
    <section className="bg-[#F8F5F1] page-padding-x py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#1a1c18]">{heading}</h2>
        <div className="mt-10 border-t border-[#d8d0c4]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-[#d8d0c4] py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl text-[#1a1c18] marker:content-none">
                {faq.question}
                <span aria-hidden="true" className="text-2xl font-light transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-4xl pb-6 pr-10 text-sm leading-7 text-[#666d62] sm:text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
