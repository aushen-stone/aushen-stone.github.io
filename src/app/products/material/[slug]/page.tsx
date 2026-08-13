import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPageRenderer } from "@/app/components/SeoLandingPageRenderer";
import { SEO_LANDING_PAGES } from "@/data/seoLandingPages";
import { canonicalUrl, buildMetadata } from "@/lib/seo";
import { getSeoLandingPageProducts, seoLandingPagePath } from "@/lib/seoLandingPages";

export const dynamicParams = false;
const pages = SEO_LANDING_PAGES.filter((page) => page.kind === "material");
export function generateStaticParams() { return pages.map((page) => ({ slug: page.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages.find((item) => item.slug === slug);
  return page ? buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: seoLandingPagePath(page) }) : buildMetadata({ title: "Page Not Found | Aushen Stone", path: `/products/material/${slug}/`, index: false });
}
export default async function MaterialLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages.find((item) => item.slug === slug);
  if (!page) notFound();
  const url = canonicalUrl(seoLandingPagePath(page));
  const products = getSeoLandingPageProducts(page);
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: canonicalUrl("/products/") },
      { "@type": "ListItem", position: 3, name: page.h1, item: url },
    ] },
    { "@context": "https://schema.org", "@type": "ItemList", name: page.h1, itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: getProductDisplayName(product), url: canonicalUrl(`/products/${product.slug}/`) })) },
    page.faqs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) } : null,
  ].filter(Boolean);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} /><SeoLandingPageRenderer page={page} /></>;
}

import { getProductDisplayName } from "@/data/product_display_names";
