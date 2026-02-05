"use client";

// src/app/products/page.tsx
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductSidebar } from "@/app/components/ProductSidebar";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/data/products.generated";
import { PRODUCT_CATEGORIES } from "@/data/categories.generated";
import {
  DEFAULT_PRODUCT_IMAGE,
  PRODUCT_OVERRIDES,
} from "@/data/product_overrides";

type FilterState = {
  material: string[];
  application: string[];
  tone: string[];
};

const CARD_ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/3]", "aspect-[3/5]"];

const slugifyTone = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const TONE_OPTIONS = (() => {
  const tones = new Map<string, string>();
  PRODUCTS.forEach((product) => {
    const override = PRODUCT_OVERRIDES[product.slug];
    override?.toneTags?.forEach((tag) => {
      const slug = slugifyTone(tag);
      if (!tones.has(slug)) {
        tones.set(slug, tag);
      }
    });
  });
  return Array.from(tones.entries()).map(([slug, name]) => ({ slug, name }));
})();

const buildInitialSelected = (
  category: string | null,
  materials: { name: string; slug: string }[],
  applications: { name: string; slug: string }[]
): FilterState => {
  const selected: FilterState = {
    material: [],
    application: [],
    tone: [],
  };

  if (!category) return selected;

  const isMaterial = materials.some((material) => material.slug === category);
  const isApplication = applications.some((app) => app.slug === category);

  if (isMaterial) {
    selected.material = [category];
  } else if (isApplication) {
    selected.application = [category];
  }

  return selected;
};

function ProductsPageContent({ initialCategory }: { initialCategory: string | null }) {
  const materials = PRODUCT_CATEGORIES.materials;
  const applications = PRODUCT_CATEGORIES.applications.map((app) => ({
    name: app.name,
    slug: app.slug,
  }));
  const [selected, setSelected] = useState<FilterState>(() =>
    buildInitialSelected(initialCategory, materials, applications)
  );

  const toggleFilter = (group: keyof FilterState, slug: string) => {
    setSelected((prev) => {
      const exists = prev[group].includes(slug);
      const next = exists ? prev[group].filter((item) => item !== slug) : [...prev[group], slug];
      return { ...prev, [group]: next };
    });
  };

  const clearFilters = () =>
    setSelected({
      material: [],
      application: [],
      tone: [],
    });

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selected.material.length > 0 && !selected.material.includes(product.materialId)) {
        return false;
      }

      if (selected.application.length > 0) {
        const productApplications = new Set<string>();
        product.finishes.forEach((finish) => {
          finish.applications.forEach((app) => {
            productApplications.add(app.categorySlug);
          });
        });
        if (!selected.application.some((slug) => productApplications.has(slug))) {
          return false;
        }
      }

      if (selected.tone.length > 0) {
        const override = PRODUCT_OVERRIDES[product.slug];
        const productTones = (override?.toneTags || []).map(slugifyTone);
        if (!selected.tone.some((slug) => productTones.includes(slug))) {
          return false;
        }
      }

      return true;
    });
  }, [selected]);
  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <Navbar />

      {/* --- 1. Page Header (Artistic & Textured) --- */}
      <section className="relative pt-44 pb-24 px-6 md:px-12 overflow-hidden bg-[#1a1c18]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#2A2D28_0%,_#151614_100%)]"></div>

        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        ></div>

        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.2em] text-white/90 mb-6 backdrop-blur-md bg-white/5">
              Collection 2025
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-[#F0F2E4] leading-[0.9]">
              The Stone <br /> <span className="italic text-white/40">Archive</span>
            </h1>
          </div>

          <p className="text-white/70 text-sm md:text-base font-light max-w-sm leading-relaxed border-l border-white/30 pl-6">
            Curated from the world&apos;s finest quarries. A dialogue between raw nature and refined architecture.
          </p>
        </div>
      </section>

      {/* --- 2. Main Content (Masonry Layout) --- */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-20">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-10 sticky top-24 z-30">
          <button className="w-full flex items-center justify-between bg-[#1a1c18] text-white px-6 py-4 shadow-lg">
            <span className="uppercase tracking-widest text-xs font-medium">Filter Collection</span>
            <span className="text-xs">+</span>
          </button>
        </div>

        <div className="flex gap-16">
          <ProductSidebar
            materials={materials}
            applications={applications}
            tones={TONE_OPTIONS}
            selected={selected}
            onToggle={toggleFilter}
            onClear={clearFilters}
          />

          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-end mb-12">
              <div className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 cursor-pointer transition-colors group">
                <span>Sort by Newest</span>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-gray-900 transition-colors"></div>
              </div>
            </div>

            {/* Masonry */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center text-sm text-gray-500">
                No products match the current filters.{" "}
                <button
                  onClick={clearFilters}
                  className="uppercase tracking-widest text-xs text-gray-900 underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {filteredProducts.map((product, index) => {
                  const override = PRODUCT_OVERRIDES[product.slug];
                  const imageUrl = override?.imageUrl || DEFAULT_PRODUCT_IMAGE;
                  const aspect = CARD_ASPECTS[index % CARD_ASPECTS.length];
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group cursor-pointer break-inside-avoid block"
                    >
                      {/* Image Container */}
                      <div className={`relative ${aspect} overflow-hidden bg-[#E5E5E5]`}>
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                        />

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                            <ArrowUpRight size={20} className="text-gray-900" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="pt-5 flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-2xl text-gray-900 leading-none group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">
                            {product.name}
                          </h3>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">
                            {product.materialName}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Loader */}
            <div className="mt-32 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="font-serif italic text-2xl mb-2">Discover More</span>
              <div className="h-12 w-[1px] bg-gray-900"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const searchKey = searchParams.toString() || "all";

  return (
    <ProductsPageContent
      key={searchKey}
      initialCategory={initialCategory}
    />
  );
}
