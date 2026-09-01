import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";
import { buildMetadata } from "@/lib/seo";
import { SERVICES_SEO_CONTENT } from "@/data/pageSeoContent";

export const metadata: Metadata = buildMetadata({
  title: "Stone Fabrication & Cutting Service Melbourne | Aushen Stone",
  description:
    "Professional stone fabrication and precision stone cutting in Melbourne for paving, pool coping, wall cladding, benchtops and bespoke architectural stone.",
  path: "/services/",
});

export default function ServicesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SERVICES_SEO_CONTENT.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /><ServicesPageClient /></>;
}
