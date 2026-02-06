"use client";

import { useState } from "react";
import { Footer } from "@/app/components/Footer";
import { MoveDown, CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const FABRICATION_SERVICES = [
  {
    id: "profiling",
    title: "Edge Profiling",
    description: "From classic pencil rounds to complex drop-face coping. We shape the stone to fit your design language, ensuring every edge is smooth, safe, and aesthetically perfect.",
    features: ["Bullnose & Pencil Edge", "Drop Face Coping", "Mitred Aprons"],
    image: "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "curved",
    title: "Curved Cutting",
    description: "Standard pavers don't fit curved pools. Our specialized waterjet and bridge saw technology allows us to cut precise radii, creating a seamless flow for organic shapes.",
    features: ["Radius Cutting", "Template Matching", "Zero-tolerance Fit"],
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "bespoke",
    title: "Bespoke Custom",
    description: "Need a hole for a light fixture? A specific drain cutout? Or a custom-engraved piece? We handle all technical modifications in-house to save you time on site.",
    features: ["Core Drilling", "Skimmer Box Lids", "Custom Grates"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
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
              Our Expertise
            </span>
            <h1 className="font-serif text-[clamp(2.2rem,8vw,6rem)] text-[#F8F5F1] leading-[0.9] tracking-tight">
              Beyond <br/> <span className="italic text-white/30 ml-4 md:ml-12">The Stone</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-8">
             <p className="text-white/60 text-sm font-light max-w-sm text-right leading-loose hidden md:block">
               We don&apos;t just supply natural stone. We craft, customize, and curate it to fit your vision perfectly.
             </p>
             <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-widest animate-pulse">
                Process <MoveDown size={14} />
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. FABRICATION (Dark + Numbering)
         ========================================= */}
      <section className="bg-[#1a1c18] text-[#F8F5F1] pt-24 sm:pt-32 pb-32 sm:pb-48 page-padding-x relative border-t border-white/5 z-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-20">
             <span className="text-[#3B4034] bg-[#F0F2E4] px-2 py-1 text-[10px] uppercase tracking-widest rounded mb-4 inline-block">The Workshop</span>
             <h2 className="font-serif text-3xl md:text-5xl">Precision Fabrication</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Service List with Numbers */}
            <div className="lg:col-span-5 flex flex-col gap-0">
               {FABRICATION_SERVICES.map((service, index) => (
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
                     <img src={FABRICATION_SERVICES[activeService].image} alt={FABRICATION_SERVICES[activeService].title} className="w-full h-full object-cover opacity-80" />
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

      {/* =========================================
          3. CONSULTATION (Overlap / Broken Grid)
         ========================================= */}
      <section className="bg-[#F8F5F1] pb-24 page-padding-x overflow-hidden relative z-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Visual: Image Overlap (Refinement) */}
            {/* -mt-24 md:-mt-48 makes it overlap the dark section above */}
            <div className="lg:col-span-7 relative -mt-24 md:-mt-48 z-20">
              <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden shadow-2xl">
                 <img
                   src="https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?q=80&w=1600&auto=format&fit=crop"
                   alt="Showroom Consultation"
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 shadow-xl max-w-xs hidden md:block border border-gray-100">
                 <p className="font-serif italic text-2xl text-[#1a1c18] mb-4">&quot;Bring your plans, the coffee is on us.&quot;</p>
                 <div className="h-[1px] w-12 bg-[#1a1c18]/20"></div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 lg:pl-12 pt-12 md:pt-0">
               <span className="text-[#3B4034] text-[10px] uppercase tracking-widest mb-4 block">Design Consultation</span>
               <h2 className="font-serif text-4xl md:text-5xl text-[#1a1c18] mb-8 leading-tight">
                 Not sure where <br/> to start?
               </h2>
               <p className="text-gray-600 leading-loose mb-8 font-light">
                 Navigating natural stone options can be overwhelming. Our experienced team is here to guide you through color palettes, finishes, and technical suitability for your specific project.
               </p>
               <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#1a1c18] text-white px-6 sm:px-8 py-4 uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[11px] sm:text-xs hover:bg-[#3B4034] transition-colors shadow-xl shadow-gray-900/10">
                 Book a Consultation
                 <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
               </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          4. LOGISTICS (Architectural Grid Lines)
         ========================================= */}
      <section className="bg-[#F8F5F1] pb-24 sm:pb-32 page-padding-x">
        <div className="max-w-[1600px] mx-auto pt-24">

           <div className="mb-12 flex items-end justify-between">
              <h2 className="font-serif text-3xl text-[#1a1c18]">Seamless Delivery</h2>
              <span className="hidden md:block text-[10px] uppercase tracking-widest text-gray-400">Step 03 — Final Mile</span>
           </div>

           {/* Refinement: Grid Lines using Borders instead of Gap */}
           <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-200 border-l border-gray-200">

              {/* Card 1 */}
              <div className="group border-b border-gray-200 border-r border-gray-200 p-8 md:p-12 hover:bg-white transition-colors duration-500">
                 <div className="mb-8 w-12 h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <BlueprintIcon type="network" />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-[#1a1c18]">Trusted Installer Network</h3>
                 <p className="text-sm text-gray-500 leading-relaxed font-light">
                    We don&apos;t install, but we know who does it best. Access our curated list of verified professionals.
                 </p>
              </div>

              {/* Card 2 */}
              <div className="group border-b border-gray-200 border-r border-gray-200 p-8 md:p-12 hover:bg-white transition-colors duration-500">
                 <div className="mb-8 w-12 h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <BlueprintIcon type="logistics" />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-[#1a1c18]">Flexible Logistics</h3>
                 <p className="text-sm text-gray-500 leading-relaxed font-light">
                    Tight access? No problem. We coordinate crane trucks to ensure your stone is delivered safely.
                 </p>
              </div>

              {/* Card 3 */}
              <div className="group border-b border-gray-200 border-r border-gray-200 p-8 md:p-12 hover:bg-white transition-colors duration-500">
                 <div className="mb-8 w-12 h-12 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <BlueprintIcon type="support" />
                 </div>
                 <h3 className="font-serif text-xl mb-3 text-[#1a1c18]">After-Care Support</h3>
                 <p className="text-sm text-gray-500 leading-relaxed font-light">
                    Detailed advice on sealing, cleaning, and maintaining your stone for decades to come.
                 </p>
              </div>

           </div>
        </div>
      </section>

      {/* =========================================
          5. CTA
         ========================================= */}
      <section className="bg-[#1a1c18] text-[#F8F5F1] py-24 border-t border-white/10">
         <div className="max-w-[1600px] mx-auto page-padding-x flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <h2 className="font-serif text-3xl md:text-5xl mb-2">Ready to begin?</h2>
               <p className="text-white/40 font-light">Let&apos;s discuss your project over coffee.</p>
            </div>
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3 sm:gap-4">
               <button className="w-full sm:w-auto border border-white/20 px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] hover:bg-white hover:text-[#1a1c18] transition-colors">
                  Contact Us
               </button>
               <button className="w-full sm:w-auto bg-white text-[#1a1c18] px-6 sm:px-8 py-4 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] hover:bg-[#F0F2E4] transition-colors">
                  Visit Showroom
               </button>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
