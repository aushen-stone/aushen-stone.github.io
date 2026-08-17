import Link from "next/link";
import { Footer } from "@/app/components/Footer";
import { ProductCard } from "@/app/products/ProductCard";
import type { SeoLandingPage } from "@/types/seoLandingPage";
import { getSeoLandingPageProducts } from "@/lib/seoLandingPages";

export function SeoLandingPageRenderer({ page }: { page: SeoLandingPage }) {
  const products = getSeoLandingPageProducts(page);

  return (
    <>
      <main className="bg-[#F8F5F1] text-[#252820]">
        <header className="page-padding-x border-b border-[#D8D2C8] pb-6 pt-28 sm:pb-8 sm:pt-32 lg:pt-36">
          <div className="mx-auto max-w-[1600px]">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#68705c]">
              {page.kind === "material" ? "Stone material" : "Stone application"}
            </p>
            <h1 className="max-w-5xl font-serif text-[clamp(1.7rem,4vw,2.75rem)] leading-[0.95]">{page.h1}</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[#555a4d]">{page.intro}</p>
            {page.serviceArea ? <p className="mt-3 text-xs text-[#68705c]">Serving {page.serviceArea}</p> : null}
          </div>
        </header>

        <div className="page-padding-x mx-auto max-w-[1600px] py-5 sm:py-6">
          {products.length ? (
            <section className="pb-12 sm:pb-16">
              <h2 className="mb-5 font-serif text-[1.7rem] leading-tight">Explore the range</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {page.sections.map((section) => (
            <section key={section.id} className="grid gap-5 border-t border-[#D8D2C8] py-10 md:grid-cols-[1fr_2fr]">
              <h2 className="font-serif text-3xl">{section.heading}</h2>
              <p className="max-w-3xl whitespace-pre-line leading-7 text-[#555a4d]">{section.body}</p>
            </section>
          ))}

          {page.faqs.length ? (
            <section className="border-t border-[#D8D2C8] py-12">
              <h2 className="mb-8 font-serif text-3xl">Frequently asked questions</h2>
              <div className="max-w-4xl divide-y divide-[#D8D2C8]">
                {page.faqs.map((faq) => (
                  <details key={faq.id} className="py-5">
                    <summary className="cursor-pointer font-medium">{faq.question}</summary>
                    <p className="mt-4 leading-7 text-[#555a4d]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {page.exploreLinks.length ? (
            <nav aria-label="Explore related pages" className="flex flex-wrap gap-3 border-t border-[#D8D2C8] py-10">
              {page.exploreLinks.map((item) => <Link key={item.id} href={item.href} className="border border-[#68705c] px-5 py-3 text-sm hover:bg-[#283020] hover:text-white">{item.label}</Link>)}
            </nav>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
