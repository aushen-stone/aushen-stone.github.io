// app/page.tsx
import type { Metadata } from "next";
import { Hero } from "@/app/components/Hero"
import { BrandBanner } from "@/app/components/BrandBanner"
import { BestSellers } from "@/app/components/BestSellers"
import { ProjectShowcase } from "@/app/components/ProjectShowcase"
import { ServicesSection } from "@/app/components/ServicesSection"
import { CreativeHubSection } from "@/app/components/CreativeHubSection"
import { Footer } from "@/app/components/Footer"
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Aushen Stone | Natural Stone Supplier in Melbourne",
  description:
    "Aushen Stone supplies premium natural stone products and project support across Melbourne, from consultation to delivery.",
  path: "/",
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BrandBanner />
      <BestSellers />
      <ProjectShowcase />
      <ServicesSection />
      <CreativeHubSection />
      <Footer />
    </main>
  )
}
