/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { ArrowDownLeft, ArrowRight, Phone, Plus, Minus, MoveDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { PRODUCTS } from "@/data/products.generated";
import {
  DEFAULT_HOMEOWNER_SUMMARY,
  DEFAULT_HOMEOWNER_USE_CASES,
  DEFAULT_PROFESSIONAL_NOTES,
  DEFAULT_PROFESSIONAL_SUMMARY,
  DEFAULT_PRODUCT_DESCRIPTION,
  DEFAULT_PRODUCT_IMAGE,
  PRODUCT_OVERRIDES,
} from "@/data/product_overrides";
import type { AudienceMode, Product } from "@/types/product";

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
        <span className="text-white text-xs uppercase tracking-[0.2em] bg-black/30 backdrop-blur-md px-3 py-1 border border-white/10">
          {alt}
        </span>
      </div>
    </div>
  );
}

function OptionSelector({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            aria-pressed={selected === opt.value}
            aria-label={`${title}: ${opt.label}`}
            className={`relative px-5 py-2.5 min-h-10 text-[13px] uppercase tracking-[0.18em] transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] ${
              selected === opt.value
                ? "bg-[#1a1c18] text-white border-[#1a1c18]"
                : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-900"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AudienceToggle({
  mode,
  onChange,
}: {
  mode: AudienceMode;
  onChange: (value: AudienceMode) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">View Mode</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("homeowner")}
          aria-pressed={mode === "homeowner"}
          className={`min-h-10 px-4 text-xs uppercase tracking-[0.18em] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] ${
            mode === "homeowner"
              ? "bg-[#1a1c18] text-white border-[#1a1c18]"
              : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-900"
          }`}
        >
          Homeowner
        </button>
        <button
          type="button"
          onClick={() => onChange("professional")}
          aria-pressed={mode === "professional"}
          className={`min-h-10 px-4 text-xs uppercase tracking-[0.18em] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] ${
            mode === "professional"
              ? "bg-[#1a1c18] text-white border-[#1a1c18]"
              : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-900"
          }`}
        >
          Professional
        </button>
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
        className="w-full py-5 flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
        aria-expanded={isOpen}
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
            <div className="pb-8 text-sm text-gray-500 leading-relaxed font-light">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type ProductDetailViewProps = {
  product: Product;
};

function ProductDetailView({ product }: ProductDetailViewProps) {
  const override = PRODUCT_OVERRIDES[product.slug];
  const description = override?.description || DEFAULT_PRODUCT_DESCRIPTION;
  const imageUrl = override?.imageUrl || DEFAULT_PRODUCT_IMAGE;

  const homeownerSummary = override?.homeownerSummary || DEFAULT_HOMEOWNER_SUMMARY;
  const homeownerUseCases = override?.homeownerUseCases || DEFAULT_HOMEOWNER_USE_CASES;
  const professionalSummary = override?.professionalSummary || DEFAULT_PROFESSIONAL_SUMMARY;
  const professionalNotes = override?.professionalNotes || DEFAULT_PROFESSIONAL_NOTES;

  const sampleLabel = override?.ctaOverride?.sample || "Order Free Sample";
  const enquireLabel = override?.ctaOverride?.enquire || "Enquire";
  const consultLabel = override?.ctaOverride?.consult || "Book Consultation";

  const images = useMemo(
    () => [
      { src: imageUrl, alt: "Hero Texture Detail" },
      { src: imageUrl, alt: "Application Context" },
      { src: imageUrl, alt: "Surface Detail" },
    ],
    [imageUrl]
  );

  const applicationOptions = useMemo(
    () =>
      product.applicationIndex.map((application) => ({
        label: application.label,
        value: application.id,
      })),
    [product]
  );

  const [selectedApplicationId, setSelectedApplicationId] = useState(
    applicationOptions[0]?.value || ""
  );
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("homeowner");

  const selectedApplication =
    product.applicationIndex.find((application) => application.id === selectedApplicationId) ||
    product.applicationIndex[0];

  const finishOptions = useMemo(
    () =>
      (selectedApplication?.finishes || []).map((finish) => ({
        label: finish.slipRating ? `${finish.name} (${finish.slipRating})` : finish.name,
        value: finish.id,
      })),
    [selectedApplication]
  );

  const [selectedFinishId, setSelectedFinishId] = useState(finishOptions[0]?.value || "");

  const selectedFinish =
    selectedApplication?.finishes.find((finish) => finish.id === selectedFinishId) ||
    selectedApplication?.finishes[0];

  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    const nextApplication = product.applicationIndex.find(
      (application) => application.id === applicationId
    );
    if (nextApplication?.finishes.length) {
      setSelectedFinishId(nextApplication.finishes[0].id);
    }
  };

  const subtitle = selectedApplication
    ? `${product.materialName} • ${selectedApplication.label}`
    : product.materialName;

  const suitability = useMemo(() => {
    const labels = new Set<string>();
    product.applicationIndex.forEach((application) => labels.add(application.label));
    return labels.size > 0 ? Array.from(labels).join(", ") : "Application details coming soon.";
  }, [product]);

  const techSpecs = useMemo(
    () => [
      { label: "Material", value: product.materialName || "-" },
      { label: "Finish", value: selectedFinish?.name || "-" },
      { label: "Slip Rating", value: selectedFinish?.slipRating || "-" },
      { label: "Application", value: selectedApplication?.label || "-" },
    ],
    [product, selectedFinish, selectedApplication]
  );

  const audienceSummary =
    audienceMode === "homeowner" ? homeownerSummary : professionalSummary;
  const audienceBullets =
    audienceMode === "homeowner" ? homeownerUseCases : professionalNotes;

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <section className="relative bg-[#1a1c18] pt-40 pb-32 px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-[-20%] left-[-10%] w-[520px] h-[520px] bg-[#3B4034]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#2A2D28] to-transparent opacity-40 pointer-events-none" />

        <div className="max-w-[1800px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 border border-white/20 text-[11px] uppercase tracking-[0.2em] rounded-full text-white/70 backdrop-blur-sm">
                Premium Series
              </span>
              <span className="px-3 py-1 bg-[#F0F2E4] text-[#1a1c18] text-[11px] uppercase tracking-[0.2em] rounded-full">
                In Stock
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#F8F5F1] leading-[0.9] mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 text-white/50 font-serif italic text-xl">
              <span className="block h-[1px] w-12 bg-white/20" />
              {subtitle}
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 items-end justify-end pb-4">
            <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-widest">
              Scroll to Explore <MoveDown size={14} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-32 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-16">
            <HeroParallaxImage src={images[0].src} alt={images[0].alt} />

            {images.slice(1).map((img, index) => (
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
                  <span className="text-white text-xs uppercase tracking-[0.2em] bg-black/30 backdrop-blur-md px-3 py-1 border border-white/10">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 relative h-full pt-20 lg:pt-32">
            <div className="sticky top-32 flex flex-col gap-10 pl-0 lg:pl-12 border-l-0 lg:border-l border-gray-200">
              <div className="space-y-4">
                <h4 className="font-serif text-2xl text-gray-900">About the Stone</h4>
                <p className="text-gray-700 leading-loose font-light text-base">{description}</p>
              </div>

              <div className="py-6 border-y border-gray-100">
                <AudienceToggle mode={audienceMode} onChange={setAudienceMode} />
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">{audienceSummary}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {audienceBullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-4 border-t border-gray-100">
                <OptionSelector
                  title="Application"
                  options={applicationOptions}
                  selected={selectedApplicationId}
                  onSelect={handleApplicationSelect}
                />
                <OptionSelector
                  title="Surface Finish"
                  options={finishOptions}
                  selected={selectedFinishId}
                  onSelect={setSelectedFinishId}
                />

                {selectedFinish && (
                  <div className="mt-6">
                    <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFinish.sizes.map((size) => (
                        <span
                          key={size.raw}
                          className="px-3 py-1.5 text-xs uppercase tracking-[0.18em] border border-gray-200 text-gray-600"
                        >
                          {size.raw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {audienceMode === "homeowner" ? (
                <div className="flex flex-col gap-4">
                  <button
                    className="w-full bg-[#1a1c18] text-[#F8F5F1] py-5 px-8 flex items-center justify-between group hover:bg-[#3B4034] transition-all duration-500 shadow-xl shadow-gray-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                    aria-label={sampleLabel}
                  >
                    <span className="uppercase tracking-[0.22em] text-xs font-medium">{sampleLabel}</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-500 group-hover:translate-x-2"
                    />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="border border-gray-300 text-gray-900 py-4 px-6 flex items-center justify-center gap-3 hover:border-gray-900 transition-all uppercase tracking-[0.15em] text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                      aria-label={consultLabel}
                    >
                      {consultLabel}
                    </button>
                    <button
                      className="border border-gray-300 text-gray-900 py-4 px-6 flex items-center justify-center gap-3 hover:border-gray-900 transition-all uppercase tracking-[0.15em] text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                      aria-label={enquireLabel}
                    >
                      <ArrowDownLeft size={14} /> {enquireLabel}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    className="w-full bg-[#1a1c18] text-[#F8F5F1] py-5 px-8 flex items-center justify-between group hover:bg-[#3B4034] transition-all duration-500 shadow-xl shadow-gray-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                    aria-label={enquireLabel}
                  >
                    <span className="uppercase tracking-[0.22em] text-xs font-medium">{enquireLabel}</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-500 group-hover:translate-x-2"
                    />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="border border-gray-300 text-gray-900 py-4 px-6 flex items-center justify-center gap-3 hover:border-gray-900 transition-all uppercase tracking-[0.15em] text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                      aria-label="Call us"
                    >
                      <Phone size={14} /> Call Us
                    </button>
                    <button
                      className="border border-gray-300 text-gray-900 py-4 px-6 flex items-center justify-center gap-3 hover:border-gray-900 transition-all uppercase tracking-[0.15em] text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                      aria-label={sampleLabel}
                    >
                      {sampleLabel}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <AccordionItem title="Technical Specifications" defaultOpen>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {techSpecs.map((spec) => (
                      <div key={spec.label} className="flex flex-col">
                        <span className="text-xs uppercase text-gray-500 tracking-[0.14em] mb-1">
                          {spec.label}
                        </span>
                        <span className="font-serif text-lg text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionItem>

                <AccordionItem title="Suitability & Application">
                  <p>{suitability}</p>
                </AccordionItem>

                <AccordionItem title="Delivery Information">
                  <p>Stock items dispatched within 48 hours.</p>
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

export default function ProductDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const product = useMemo(() => PRODUCTS.find((item) => item.slug === slug), [slug]);

  if (!product) {
    return (
      <main className="bg-[#F8F5F1] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-40">
          <h1 className="font-serif text-4xl text-gray-900 mb-4">Stone not found</h1>
          <p className="text-gray-600">The product you&apos;re looking for is not available yet.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return <ProductDetailView key={product.slug} product={product} />;
}
