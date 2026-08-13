import Link from "next/link";
import { Footer } from "@/app/components/Footer";
import { getProductDisplayName } from "@/data/product_display_names";
import type { SeoLandingPage } from "@/types/seoLandingPage";
import { PRODUCT_OVERRIDES, DEFAULT_PRODUCT_IMAGE } from "@/data/product_overrides";
import { getSeoLandingPageProducts } from "@/lib/seoLandingPages";

export function SeoLandingPageRenderer({ page }: { page: SeoLandingPage }) {
  const products = getSeoLandingPageProducts(page);

  return (
    <>
      <main className="bg-[#F8F5F1] text-[#252820]">
        <header className="page-padding-x border-b border-[#D8D2C8] py-20 sm:py-28">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-[#68705c]">
            {page.kind === "material" ? "Stone material" : "Stone application"}
          </p>
          <h1 className="max-w-5xl font-serif text-5xl leading-[1.02] sm:text-7xl">{page.h1}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#555a4d]">{page.intro}</p>
          {page.serviceArea ? <p className="mt-5 text-sm text-[#68705c]">Serving {page.serviceArea}</p> : null}
        </header>

        <div className="page-padding-x py-16 sm:py-24">
          {products.length ? (
            <section className="pb-16 sm:pb-24">
              <h2 className="mb-8 font-serif text-3xl">Explore the range</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const image = PRODUCT_OVERRIDES[product.slug]?.imageUrl ?? DEFAULT_PRODUCT_IMAGE;
                  return (
                    <Link key={product.slug} href={`/products/${product.slug}/`} className="group overflow-hidden border border-[#D8D2C8] bg-white">
                      <img src={image} alt={getProductDisplayName(product)} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                      <span className="block p-5 font-serif text-2xl">{getProductDisplayName(product)}</span>
                    </Link>
                  );
                })}
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
