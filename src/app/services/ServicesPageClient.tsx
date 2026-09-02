"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/app/components/Footer";
import { MoveDown, CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CMS_LEGACY_PAGES } from "@/data/cms-site.generated";
import { SERVICES_SEO_CONTENT } from "@/data/pageSeoContent";
import { FaqSection } from "@/app/components/FaqSection";

// --- MOCK DATA ---
const FABRICATION_SERVICES = [
  {
    id: "profiling",
    title: "Edge Profiling",
    description: "From classic pencil rounds to complex drop-face coping. We shape the stone to fit your design language, ensuring every edge is smooth, safe, and aesthetically perfect.",
    features: ["Bullnose & Pencil Edge", "Drop Face Coping", "Mitred Aprons"],
    image: "/task-a-2026-02-24/svc-profiling.webp"
  },
  {
    id: "curved",
    title: "Curved Cutting",
    description: "Standard pavers don't fit curved pools. Our specialized waterjet and bridge saw technology allows us to cut precise radii, creating a seamless flow for organic shapes.",
    features: ["Radius Cutting", "Template Matching", "Zero-tolerance Fit"],
    image: "/task-a-2026-02-24/svc-curved.webp"
  },
  {
    id: "bespoke",
    title: "Bespoke Custom",
    description: "Need a hole for a light fixture? A specific drain cutout? Or a custom-engraved piece? We handle all technical modifications in-house to save you time on site.",
    features: ["Core Drilling", "Skimmer Box Lids", "Custom Grates"],
    image: "/task-a-2026-02-24/svc-bespoke.webp"
  }
];

// === Blueprint Icon Component ===
function BlueprintIcon({ type }: { type: 'network' | 'logistics' | 'support' }) {
  if (type === 'network') {
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-[#1a1c18]">
        <circle cx="8" cy="12" r="5" />
        <circle cx="16" cy="12" r="5" />
        <path d="M12 7v10" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (type === 'logistics') {
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-[#1a1c18]">
        <rect x="2" y="6" width="14" height="10" />
        <path d="M16 10h4l2 3v3h-2" />
        <circle cx="7" cy="16" r="2" />
        <circle cx="17" cy="16" r="2" />
        <path d="M2 16h3M9 16h6M19 16h3" />
      </svg>
    );
  }
  return ( // support
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-[#1a1c18]">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0);
  const content = CMS_LEGACY_PAGES.services;
  const fabricationServices = content?.fabrication?.items?.length
    ? content.fabrication.items
    : FABRICATION_SERVICES;
  const consultation = content?.consultation;
  const logistics = content?.logistics;
  const logisticsItems = logistics?.items?.length === 3 ? logistics.items : [
    { title: "Trusted Installer Network", text: "We don't install, but we know who does it best. Access our curated list of verified professionals.", icon: "network" as const },
    { title: "Flexible Logistics", text: "Tight access? No problem. We coordinate crane trucks to ensure your stone is delivered safely.", icon: "logistics" as const },
    { title: "After-Care Support", text: "Detailed advice on sealing, cleaning, and maintaining your stone for decades to come.", icon: "support" as const },
  ];
  const cta = content?.cta;

  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#1a1c18] selection:text-white">
      {/* =========================================
          1. HERO (Dark)
         ========================================= */}
      <section className="relative bg-[#1a1c18] pt-36 sm:pt-40 md:pt-44 pb-24 sm:pb-32 page-padding-x overflow-hidden z-10">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#2A2D28] to-transparent opacity-40 pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-3xl">
            <span className="block text-white/40 text-[10px] uppercase tracking-[0.3em] mb-6 pl-1 border-l border-white/20">
              {content?.hero?.eyebrow || "Our Expertise"}
            </span>
            <h1 className="font-serif text-[clamp(2.4rem,6vw,5.6rem)] text-[#F8F5F1] leading-[0.95] tracking-tight">
              {content?.hero?.seoTitle || SERVICES_SEO_CONTENT.title}
            </h1>
            <h2 className="mt-7 font-serif text-2xl italic text-white/35 sm:text-3xl">
              {content?.hero?.tagline || "Beyond the Stone"}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-8">
             <p className="text-white/60 text-sm font-light max-w-lg text-left md:text-right leading-loose">
               {SERVICES_SEO_CONTENT.introduction}
             </p>
             <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-widest animate-pulse">
                Process <MoveDown size={14} />
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. LOGISTICS (Architectural Grid Lines)
         ========================================= */}
      <section className="bg-[#F8F5F1] pb-24 sm:pb-32 page-padding-x">
        <div className="max-w-[1600px] mx-auto pt-24">

           <div className="mb-12 flex items-end justify-between">
              <h2 className="font-serif text-3xl text-[#1a1c18]">Choose Aushen For Expert Stone Cutting Service</h2>
              <span className="hidden md:block text-[10px] uppercase tracking-widest text-gray-400">Project support</span>
           </div>

           {/* Refinement: Grid Lines using Borders instead of Gap */}
           <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-200 border-l border-gray-200">

              {/* Card 1 */}
              <div className="group border-b border-gray-200 border-r border-gray-200 p-8 md:p-12 hover:bg-white transition-colors duration-500">
                 <div className="mb-8 w-12 h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <BlueprintIcon type={logisticsItems[0].icon} />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-[#1a1c18]">{logisticsItems[0].title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed font-light">
                    {logisticsItems[0].text}
                 </p>
              </div>

              {/* Card 2 */}
              <div className="group border-b border-gray-200 border-r border-gray-200 p-8 md:p-12 hover:bg-white transition-colors duration-500">
                 <div className="mb-8 w-12 h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <BlueprintIcon type={logisticsItems[1].icon} />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-[#1a1c18]">{logisticsItems[1].title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed font-light">
                    {logisticsItems[1].text}
                 </p>
              </div>

              {/* Card 3 */}
              <div className="group border-b border-gray-200 border-r border-gray-200 p-8 md:p-12 hover:bg-white transition-colors duration-500">
                 <div className="mb-8 w-12 h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <BlueprintIcon type={logisticsItems[2].icon} />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-[#1a1c18]">{logisticsItems[2].title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed font-light">
                    {logisticsItems[2].text}
                 </p>
              </div>

           </div>
        </div>
      </section>

      {/* =========================================
          3. FABRICATION (Dark + Numbering)
         ========================================= */}
      <section className="bg-[#1a1c18] text-[#F8F5F1] pt-24 sm:pt-32 pb-32 sm:pb-48 page-padding-x relative border-t border-white/5 z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-20">
             <span className="text-[#3B4034] bg-[#F0F2E4] px-2 py-1 text-[10px] uppercase tracking-widest rounded mb-4 inline-block">{content?.fabrication?.eyebrow || "The Workshop"}</span>
             <h2 className="font-serif text-3xl md:text-5xl">How Does Our Stone Fabrication Process Work?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Service List with Numbers */}
            <div className="lg:col-span-5 flex flex-col gap-0">
               {fabricationServices.map((service, index) => (
                 <div
                   key={service.id}
                   className={`group py-10 border-b border-white/10 transition-all duration-500 ${
                     activeService === index ? "opacity-100" : "opacity-70 hover:opacity-90"
                   }`}
                 >
                   <button
                     type="button"
                     onClick={() => setActiveService(index)}
                     onFocus={() => setActiveService(index)}
                     onMouseEnter={() => setActiveService(index)}
                     aria-expanded={activeService === index}
                     aria-controls={`service-panel-${service.id}`}
                     className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1c18]"
                   >
                     <div className="flex items-baseline gap-4 mb-4">
                       <span className="font-serif italic text-white/20 text-xl">0{index + 1}/</span>
                       <h3
                         className={`font-serif text-2xl md:text-3xl transition-colors ${
                           activeService === index ? "text-white" : "text-white/60"
                         }`}
                       >
                         {service.title}
                       </h3>
                     </div>
                   </button>

                   <motion.div
                     id={`service-panel-${service.id}`}
                     initial={false}
                     animate={{
                       height: activeService === index ? "auto" : 0,
                       opacity: activeService === index ? 1 : 0,
                     }}
                     className="overflow-hidden pl-10"
                   >
                     <p className="text-sm text-white/60 leading-relaxed font-light mb-6">
                       {service.description}
                     </p>
                     <ul className="space-y-2">
                       {service.features.map((feature) => (
                         <li
                           key={feature}
                           className="flex items-center gap-3 text-xs uppercase tracking-widest text-white/40"
                         >
                           <CheckCircle2 size={12} className="text-[#3B4034]" /> {feature}
                         </li>
                       ))}
                     </ul>
                   </motion.div>
                 </div>
               ))}
            </div>

            {/* Sticky Image */}
            <div className="lg:col-span-7 relative h-[clamp(420px,58vh,600px)] hidden lg:block">
               <div className="sticky top-[var(--content-sticky-top)] w-full h-full rounded-sm overflow-hidden bg-white/5 border border-white/10">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={activeService}
                     initial={{ opacity: 0, scale: 1.1 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.7 }}
                     className="absolute inset-0 w-full h-full"
                   >
                     <img src={fabricationServices[activeService].image} alt={fabricationServices[activeService].title} className="w-full h-full object-cover opacity-80" />
                     <div className="absolute inset-0 bg-[#1a1c18]/20 mix-blend-multiply"></div>
                   </motion.div>
                 </AnimatePresence>
                 <div className="absolute bottom-8 left-8 z-10">
                    <span className="bg-black/30 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] px-4 py-2">Aushen Craftsmanship</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white page-padding-x py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Accuracy and finish</p>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.2rem)] leading-tight text-[#1a1c18]">Benefits Of Professional Stone Fabrication</h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-[#3f463e]">Are you searching for reliable stone fabrication shops? You have come to the right place.</p>
            <div className="mt-8 space-y-5 border-t border-[#d8d0c4] pt-7">
              {SERVICES_SEO_CONTENT.benefits.map((benefit) => (
                <p key={benefit} className="text-sm leading-7 text-[#666d62] sm:text-base">{benefit}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F5F1] page-padding-x py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">Workshop capabilities</p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.2rem)] text-[#1a1c18]">Stone Fabrication Services</h2>
          <div className="mt-10 overflow-x-auto border border-[#d8d0c4] bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#d8d0c4] bg-[#ede8df] text-[10px] uppercase tracking-[0.2em] text-[#73796f]">
                  <th className="px-6 py-4 font-medium sm:px-8">Service</th>
                  <th className="px-6 py-4 font-medium sm:px-8">Best for</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES_SEO_CONTENT.serviceRows.map(([service, bestFor]) => (
                  <tr key={service} className="border-b border-[#e4ded5] last:border-b-0">
                    <th scope="row" className="px-6 py-5 font-serif text-xl font-normal text-[#1a1c18] sm:px-8">{service}</th>
                    <td className="px-6 py-5 text-sm text-[#666d62] sm:px-8">{bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================
          4. CONSULTATION (Overlap / Broken Grid)
         ========================================= */}
      <section className="bg-[#F8F5F1] pb-24 page-padding-x overflow-hidden relative z-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Visual: Image */}
            <div className="lg:col-span-7 relative z-20">
              <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden shadow-2xl">
                 <img
                   src={consultation?.image || "/task-a-2026-02-24/svc-consultation.webp"}
                   alt={consultation?.imageAlt || "Showroom Consultation"}
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 shadow-xl max-w-xs hidden md:block border border-gray-100">
                 <p className="font-serif italic text-2xl text-[#1a1c18] mb-4">&quot;{consultation?.quote || "Bring your plans, the coffee is on us."}&quot;</p>
                 <div className="h-[1px] w-12 bg-[#1a1c18]/20"></div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 lg:pl-12 pt-12 md:pt-0">
               <span className="text-[#3B4034] text-[10px] uppercase tracking-widest mb-4 block">{consultation?.eyebrow || "Design Consultation"}</span>
               <h2 className="font-serif text-4xl md:text-5xl text-[#1a1c18] mb-8 leading-tight">
                 {consultation?.heading || "Not sure where to start?"}
               </h2>
               <p className="text-gray-600 leading-loose mb-8 font-light">
                 {consultation?.text || "Navigating natural stone options can be overwhelming. Our experienced team is here to guide you through color palettes, finishes, and technical suitability for your specific project."}
               </p>
               <Link
                 href={consultation?.href || "/contact"}
                 className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#1a1c18] text-white px-6 sm:px-8 py-4 uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[11px] sm:text-xs hover:bg-[#3B4034] transition-colors shadow-xl shadow-gray-900/10"
               >
                 {consultation?.label || "Book a Consultation"}
                 <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
               </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#1a1c18] page-padding-x py-20 text-[#F8F5F1] sm:py-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Related applications</p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.2rem)]">Explore More Services</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">We offer a complete range of natural stone supply and fabrication services.</p>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
            {SERVICES_SEO_CONTENT.exploreLinks.map((item) => (
              <Link key={item.title} href={item.href} className="group bg-[#1a1c18] p-7 transition-colors hover:bg-[#242820] sm:p-9">
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/50">{item.text}</p>
                <span className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/75">Explore <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={SERVICES_SEO_CONTENT.faqs} heading="Stone Fabrication FAQs" />

      {/* =========================================
          5. CTA
         ========================================= */}
      <section className="bg-[#1a1c18] text-[#F8F5F1] py-24 border-t border-white/10">
         <div className="max-w-[1600px] mx-auto page-padding-x flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <h2 className="font-serif text-3xl md:text-5xl mb-2">Get Your Stone Fabrication Quote Today</h2>
               <p className="max-w-2xl text-white/40 font-light">Whether you need a single custom-cut stone or complete fabrication for a large construction project, Aushen Stone is ready to help.</p>
            </div>
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3 sm:gap-4">
               <Link
                 href={cta?.primaryHref || "/contact"}
                 className="w-full sm:w-auto border border-white/20 px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] hover:bg-white hover:text-[#1a1c18] transition-colors"
               >
                  {cta?.primaryLabel || "Contact Us"}
               </Link>
               <Link
                 href={cta?.secondaryHref || "/contact"}
                 className="w-full sm:w-auto bg-white text-[#1a1c18] px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] hover:bg-[#F0F2E4] transition-colors"
               >
                  {cta?.secondaryLabel || "Visit Showroom"}
               </Link>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
