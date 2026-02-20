/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import { Footer } from "@/app/components/Footer";
import { ArrowDownLeft, ArrowRight, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSampleCart } from "@/app/components/cart/SampleCartProvider";
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
import type { AddSampleResult } from "@/types/cart";
import type { AudienceMode, Product } from "@/types/product";

type SelectOption = {
  label: string;
  value: string;
};

function SelectField({
  id,
  title,
  options,
  selected,
  onSelect,
  ariaLabel,
}: {
  id: string;
  title: string;
  options: SelectOption[];
  selected: string;
  onSelect: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500">
        {title}
      </span>
      <select
        id={id}
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
        aria-label={ariaLabel}
        disabled={options.length === 0}
        className="h-10 px-3 text-sm border border-[#D8D2C8] bg-white text-[#1D1D1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:bg-gray-50 disabled:text-gray-400"
      >
        {options.length === 0 ? (
          <option value="">Not Available</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </label>
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
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500 mb-2">
        View Mode
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("homeowner")}
          aria-pressed={mode === "homeowner"}
          className={`min-h-9 px-3 text-[11px] uppercase tracking-[0.14em] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] ${
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
          className={`min-h-9 px-3 text-[11px] uppercase tracking-[0.14em] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] ${
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
    <div className="border-b border-gray-200/60 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-expanded={isOpen}
      >
        <span className="font-serif text-base text-gray-900 group-hover:text-gray-600 transition-colors">
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
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-gray-600 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type ProductDetailViewProps = {
  product: Product;
};

type SampleFeedback = AddSampleResult | "unavailable";

function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addSample, openDrawer } = useSampleCart();
  const override = PRODUCT_OVERRIDES[product.slug];
  const description = override?.description || DEFAULT_PRODUCT_DESCRIPTION;
  const imageGallery =
    override?.imageUrls?.length && override.imageUrls.length > 0
      ? override.imageUrls
      : override?.imageUrl
      ? [override.imageUrl]
      : [DEFAULT_PRODUCT_IMAGE];

  const homeownerSummary = override?.homeownerSummary || DEFAULT_HOMEOWNER_SUMMARY;
  const homeownerUseCases = override?.homeownerUseCases || DEFAULT_HOMEOWNER_USE_CASES;
  const professionalSummary = override?.professionalSummary || DEFAULT_PROFESSIONAL_SUMMARY;
  const professionalNotes = override?.professionalNotes || DEFAULT_PROFESSIONAL_NOTES;

  const sampleLabel = override?.ctaOverride?.sample || "Order Free Sample";
  const enquireLabel = override?.ctaOverride?.enquire || "Enquire";
  const consultLabel = override?.ctaOverride?.consult || "Book Consultation";

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
  const [sampleFeedback, setSampleFeedback] = useState<SampleFeedback | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const sizeOptions = useMemo(() => {
    if (!selectedFinish) return [];

    const seen = new Set<string>();
    return selectedFinish.sizes.reduce<SelectOption[]>((acc, size) => {
      if (seen.has(size.raw)) return acc;
      seen.add(size.raw);
      acc.push({ label: size.raw, value: size.raw });
      return acc;
    }, []);
  }, [selectedFinish]);

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || "");
  const selectedSizeValue = sizeOptions.some((size) => size.value === selectedSize)
    ? selectedSize
    : sizeOptions[0]?.value || "";

  const handleApplicationSelect = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    const nextApplication = product.applicationIndex.find(
      (application) => application.id === applicationId
    );
    const nextFinish = nextApplication?.finishes[0];
    setSelectedFinishId(nextFinish?.id || "");
    setSelectedSize(nextFinish?.sizes[0]?.raw || "");
  };

  const handleFinishSelect = (finishId: string) => {
    setSelectedFinishId(finishId);
    const nextFinish = selectedApplication?.finishes.find((finish) => finish.id === finishId);
    setSelectedSize(nextFinish?.sizes[0]?.raw || "");
  };

  const handleAddSample = () => {
    if (!selectedFinish) {
      setSampleFeedback("unavailable");
      return;
    }

    const result = addSample({
      productSlug: product.slug,
      productName: product.name,
      finishId: selectedFinish.id,
      finishName: selectedFinish.name,
    });

    setSampleFeedback(result);

    if (result === "added" || result === "exists") {
      openDrawer();
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
      { label: "Application", value: selectedApplication?.label || "-" },
      { label: "Finish", value: selectedFinish?.name || "-" },
      { label: "Size", value: selectedSizeValue || "-" },
      { label: "Slip Rating", value: selectedFinish?.slipRating || "-" },
    ],
    [product, selectedApplication, selectedFinish, selectedSizeValue]
  );

  const audienceSummary =
    audienceMode === "homeowner" ? homeownerSummary : professionalSummary;
  const audienceBullets =
    audienceMode === "homeowner" ? homeownerUseCases : professionalNotes;
  const sampleFeedbackMessage =
    sampleFeedback === "added"
      ? "Sample added to trolley."
      : sampleFeedback === "exists"
      ? "This finish is already in your sample cart."
      : sampleFeedback === "limit_reached"
      ? "Sample cart can hold up to 10 finish lines."
      : sampleFeedback === "unavailable"
      ? "Select a finish before adding a sample."
      : null;
  const hasMultipleImages = imageGallery.length > 1;
  const currentImageIndex =
    imageGallery.length > 0 ? activeImageIndex % imageGallery.length : 0;
  const currentImageUrl = imageGallery[currentImageIndex] || DEFAULT_PRODUCT_IMAGE;
  const currentImageAlt = hasMultipleImages
    ? `${product.name} image ${currentImageIndex + 1} of ${imageGallery.length}`
    : product.name;

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setActiveImageIndex((previous) =>
      previous === 0 ? imageGallery.length - 1 : previous - 1
    );
  };

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setActiveImageIndex((previous) => (previous + 1) % imageGallery.length);
  };

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <section className="bg-[#1a1c18] border-b border-[#32352F] pt-28 sm:pt-32 pb-10 sm:pb-12 page-padding-x">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 border border-white/20 text-[10px] uppercase tracking-[0.16em] rounded-full text-white/70">
              Premium Series
            </span>
            <span className="px-2.5 py-1 bg-[#F0F2E4] text-[#1a1c18] text-[10px] uppercase tracking-[0.16em] rounded-full">
              In Stock
            </span>
          </div>

          <h1 className="font-serif text-[clamp(1.9rem,5vw,4.9rem)] text-[#F8F5F1] leading-[0.92]">
            {product.name}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/70">{subtitle}</p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto page-padding-x py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="lg:sticky top-[var(--content-sticky-top)]">
              <div className="relative w-full overflow-hidden border border-[#E6E0D8] bg-[#E5E5E5] aspect-[5/4] max-h-[430px]">
                <img src={currentImageUrl} alt={currentImageAlt} className="w-full h-full object-cover" />
                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/55 text-white p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label={`Previous image for ${product.name}`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/55 text-white p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label={`Next image for ${product.name}`}
                    >
                      <ChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                      {imageGallery.map((_, index) => (
                        <button
                          key={`${product.slug}-image-dot-${index + 1}`}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-white" : "bg-white/55"
                          }`}
                          aria-label={`View image ${index + 1} of ${imageGallery.length} for ${product.name}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-[var(--content-sticky-top)] space-y-4 sm:space-y-5">
              <div className="rounded-xl border border-[#E6E0D8] bg-white p-5 sm:p-6 lg:p-7 space-y-5">
                <div className="space-y-2">
                  <h2 className="font-serif text-[1.35rem] text-gray-900">About the Stone</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    id="application-select"
                    title="Application"
                    options={applicationOptions}
                    selected={selectedApplicationId}
                    onSelect={handleApplicationSelect}
                    ariaLabel="Select application"
                  />
                  <SelectField
                    id="finish-select"
                    title="Surface Finish"
                    options={finishOptions}
                    selected={selectedFinishId}
                    onSelect={handleFinishSelect}
                    ariaLabel="Select surface finish"
                  />
                  <div className="sm:col-span-2">
                    <SelectField
                      id="size-select"
                      title="Size"
                      options={sizeOptions}
                      selected={selectedSizeValue}
                      onSelect={setSelectedSize}
                      ariaLabel="Select size"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAddSample}
                    disabled={!selectedFinish}
                    className="w-full bg-[#1a1c18] text-[#F8F5F1] py-3.5 sm:py-4 px-5 sm:px-6 flex items-center justify-between group hover:bg-[#3B4034] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={sampleLabel}
                  >
                    <span className="uppercase tracking-[0.14em] text-[11px] font-medium">
                      {sampleLabel}
                    </span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="border border-gray-300 text-gray-900 py-3 px-4 sm:px-5 flex items-center justify-center gap-2.5 hover:border-gray-900 transition-all uppercase tracking-[0.12em] text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      aria-label={consultLabel}
                    >
                      {consultLabel}
                    </button>
                    <button
                      type="button"
                      className="border border-gray-300 text-gray-900 py-3 px-4 sm:px-5 flex items-center justify-center gap-2.5 hover:border-gray-900 transition-all uppercase tracking-[0.12em] text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      aria-label={enquireLabel}
                    >
                      <ArrowDownLeft size={14} /> {enquireLabel}
                    </button>
                  </div>
                </div>

                {sampleFeedbackMessage && (
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                    {sampleFeedbackMessage}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-[#E6E0D8] bg-white p-5 sm:p-6 lg:p-7">
                <AccordionItem title="Technical Specifications" defaultOpen>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {techSpecs.map((spec) => (
                      <div key={spec.label} className="flex flex-col">
                        <span className="text-[11px] uppercase text-gray-500 tracking-[0.12em] mb-1">
                          {spec.label}
                        </span>
                        <span className="font-serif text-base text-gray-900">{spec.value}</span>
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

      <section className="max-w-[1600px] mx-auto page-padding-x pb-10 sm:pb-12 lg:pb-14">
        <div className="rounded-xl border border-[#E6E0D8] bg-[#F2EEE7] p-5 sm:p-6 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 items-start">
            <div className="space-y-2">
              <h3 className="font-serif text-[1.2rem] text-gray-900">Audience Notes</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{audienceSummary}</p>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                {audienceBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full lg:w-[260px]">
              <AudienceToggle mode={audienceMode} onChange={setAudienceMode} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

type ProductDetailClientProps = {
  slug?: string;
};

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
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
