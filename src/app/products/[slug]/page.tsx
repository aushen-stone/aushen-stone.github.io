"use client";

import React, { useRef, useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ArrowDownLeft, ArrowRight, Phone, Plus, Minus, MoveDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- MOCK DATA (保持不变) ---
const PRODUCT = {
  name: "Cat's Paw Sawn Bluestone",
  subtitle: "Volcanic Basalt • Victoria",
  description:
    "A unique Australian bluestone characterized by distinctive natural air pockets (cats paws) and consistent grey tones. The sawn finish provides a non-slip surface perfect for modern architecture.",
  images: [
    {
      src: "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=1600&auto=format&fit=crop",
      alt: "Hero Texture Detail",
      type: "hero",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      alt: "Poolside Application",
      type: "lifestyle",
    },
    {
      src: "https://images.unsplash.com/photo-1517643312431-7e887884e942?q=80&w=1200&auto=format&fit=crop",
      alt: "Outdoor Paver Context",
      type: "lifestyle",
    },
  ],
  options: {
    finishes: ["Sawn", "Honed", "Sandblasted", "Chiselled"],
    sizes: ["600x300", "800x400", "600x600", "1000x500", "French Pattern"],
  },
  details: {
    techSpecs: [
      { label: "Density", value: "2650 kg/m³" },
      { label: "Water Absorption", value: "< 0.1%" },
      { label: "Origin", value: "Victoria, Australia" },
    ],
    suitability: "Driveways, Pool Coping, Patios, Wall Cladding",
    delivery: "Stock items dispatched within 48 hours.",
  },
};

// === Hero 视差图（用于破格 overlap 的第一张）===
function HeroParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden shadow-2xl aspect-[16/10] bg-[#E5E5E5]"
    >
      <motion.div style={{ y, scale }} className="w-full h-full">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>

      <div className="absolute bottom-6 left-6 z-10">
        <span className="text-white text-[10px] uppercase tracking-[0.2em] bg-black/30 backdrop-blur-md px-3 py-1 border border-white/10">
          {alt}
        </span>
      </div>
    </div>
  );
}

// === Helper Components（保持你原有交互） ===
function OptionSelector({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-3">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`relative px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-300 border ${
              selected === opt
                ? "bg-[#1a1c18] text-white border-[#1a1c18]"
                : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-900"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between group"
      >
        <span className="font-serif text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
          {title}
        </span>
        <span className="text-gray-300 group-hover:text-gray-900 transition-colors">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-sm text-gray-500 leading-relaxed font-light">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// === 主页面（Chiaroscuro 重构）===
export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // params 暂时不用也没关系（未来接真实数据用）
  void params;

  const [selectedFinish, setSelectedFinish] = useState(PRODUCT.options.finishes[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.options.sizes[0]);

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <Navbar />

      {/* --- Section 1: The Dark Atmosphere (Header) --- */}
      <section className="relative bg-[#1a1c18] pt-40 pb-32 px-6 md:px-12 overflow-hidden">
        {/* Noise */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Mossy glow / depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[520px] h-[520px] bg-[#3B4034]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#2A2D28] to-transparent opacity-40 pointer-events-none" />

        <div className="max-w-[1800px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 border border-white/20 text-[9px] uppercase tracking-[0.2em] rounded-full text-white/70 backdrop-blur-sm">
                Premium Series
              </span>
              <span className="px-3 py-1 bg-[#F0F2E4] text-[#1a1c18] text-[9px] uppercase tracking-[0.2em] rounded-full">
                In Stock
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#F8F5F1] leading-[0.9] mb-6">
              {PRODUCT.name}
            </h1>

            <div className="flex items-center gap-6 text-white/50 font-serif italic text-xl">
              <span className="block h-[1px] w-12 bg-white/20" />
              {PRODUCT.subtitle}
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 items-end justify-end pb-4">
            <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-widest">
              Scroll to Explore <MoveDown size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: The Gallery & Specs (Overlap Layout) --- */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-32 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* LEFT: Visual Stream */}
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-16">
            {/* Hero：破格压线（深浅交界） + 视差 */}
            <HeroParallaxImage src={PRODUCT.images[0].src} alt={PRODUCT.images[0].alt} />

            {/* 其余图：保持克制（你后面要继续加更高级 reveal 也很好接） */}
            {PRODUCT.images.slice(1).map((img, index) => (
              <div
                key={`${img.alt}-${index}`}
                className="relative w-full overflow-hidden shadow-xl bg-[#E5E5E5] aspect-[4/3] group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white text-[10px] uppercase tracking-[0.2em] bg-black/30 backdrop-blur-md px-3 py-1 border border-white/10">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Sticky Panel + 基准线 */}
          <div className="lg:col-span-5 relative h-full pt-20 lg:pt-32">
            <div className="sticky top-32 flex flex-col gap-10 pl-0 lg:pl-12 border-l-0 lg:border-l border-gray-200">
              {/* About */}
              <div className="space-y-4">
                <h4 className="font-serif text-2xl text-gray-900">About the Stone</h4>
                <p className="text-gray-600 leading-loose font-light text-sm md:text-base">
                  {PRODUCT.description}
                </p>
              </div>

              {/* Selectors */}
              <div className="py-4 border-t border-gray-100">
                <OptionSelector
                  title="Surface Finish"
                  options={PRODUCT.options.finishes}
                  selected={selectedFinish}
                  onSelect={setSelectedFinish}
                />
                <OptionSelector
                  title="Tile Size"
                  options={PRODUCT.options.sizes}
                  selected={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button className="w-full bg-[#1a1c18] text-[#F8F5F1] py-5 px-8 flex items-center justify-between group hover:bg-[#3B4034] transition-all duration-500 shadow-xl shadow-gray-900/10">
                  <span className="uppercase tracking-[0.25em] text-xs font-medium">
                    Order Free Sample
                  </span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 group-hover:translate-x-2"
                  />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button className="border border-gray-300 text-gray-900 py-4 px-6 flex items-center justify-center gap-3 hover:border-gray-900 transition-all uppercase tracking-[0.2em] text-[10px] font-medium">
                    <ArrowDownLeft size={14} /> Enquire
                  </button>
                  <button className="border border-gray-300 text-gray-900 py-4 px-6 flex items-center justify-center gap-3 hover:border-gray-900 transition-all uppercase tracking-[0.2em] text-[10px] font-medium">
                    <Phone size={14} /> Call Us
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="pt-6">
                <AccordionItem title="Technical Specifications" defaultOpen>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {PRODUCT.details.techSpecs.map((spec) => (
                      <div key={spec.label} className="flex flex-col">
                        <span className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">
                          {spec.label}
                        </span>
                        <span className="font-serif text-lg text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionItem>

                <AccordionItem title="Suitability & Application">
                  <p>{PRODUCT.details.suitability}</p>
                </AccordionItem>

                <AccordionItem title="Delivery Information">
                  <p>{PRODUCT.details.delivery}</p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
