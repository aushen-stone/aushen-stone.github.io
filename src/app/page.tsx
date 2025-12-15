// app/page.tsx
import { Navbar } from "@/app/components/Navbar"
import { Hero } from "@/app/components/Hero"
import { BrandBanner } from "@/app/components/BrandBanner"
import { BestSellers } from "@/app/components/BestSellers"
import { ProjectShowcase } from "@/app/components/ProjectShowcase"
import { ServicesSection } from "@/app/components/ServicesSection"
import { CreativeHubSection } from "@/app/components/CreativeHubSection"
import { Footer } from "@/app/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
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
