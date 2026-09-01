// app/page.tsx
import type { Metadata } from "next";
import { Hero } from "@/app/components/Hero"
import { BrandBanner } from "@/app/components/BrandBanner"
import { BestSellers } from "@/app/components/BestSellers"
import { AccessoriesGatewaySection } from "@/app/components/AccessoriesGatewaySection"
import { ProjectShowcase } from "@/app/components/ProjectShowcase"
import { ServicesSection } from "@/app/components/ServicesSection"
import { CreativeHubSection } from "@/app/components/CreativeHubSection"
import { TrustSignalStrip } from "@/app/components/TrustSignalStrip"
import { Footer } from "@/app/components/Footer"
import { HomeExploreNaturalStoneRangeSection, HomeNaturalStoneSuppliersSection, HomeReasonsSection, HomeSeoDetails } from "@/app/components/HomeSeoContent"
import { HOME_SEO_CONTENT } from "@/data/pageSeoContent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Natural Stone Suppliers Melbourne | Aushen Stone",
  description:
    "Aushen Stone supplies premium natural stone, paving, pool coping and wall cladding for residential, commercial and landscaping projects across Melbourne and Australia.",
  path: "/",
});

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_SEO_CONTENT.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <BrandBanner />
      <TrustSignalStrip />
      <BestSellers />
      <HomeReasonsSection />
      <AccessoriesGatewaySection />
      <ProjectShowcase />
      <ServicesSection />
      <HomeNaturalStoneSuppliersSection />
      <HomeExploreNaturalStoneRangeSection />
      <CreativeHubSection />
      <HomeSeoDetails />
      <Footer />
    </main>
  )
}
