/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { PRODUCTS } from "@/data/products.generated";
import { PRODUCT_CATEGORIES } from "@/data/categories.generated";
import { getProductDisplayName } from "@/data/product_display_names";
import {
  DEFAULT_PRODUCT_IMAGE,
  PRODUCT_OVERRIDES,
} from "@/data/product_overrides";
import {
  PRODUCTS_RETURN_CONTEXT_STORAGE_KEY,
  type ProductsReturnContext,
} from "@/types/productNavigation";
import type { Product } from "@/types/product";

type FilterState = {
  query: string;
  material: string;
  application: string;
  tone: string;
};

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

const buildInitialFilters = (
  category: string | null,
  materials: { name: string; slug: string }[],
  applications: { name: string; slug: string }[]
): FilterState => {
  const selected: FilterState = {
    query: "",
    material: "",
    application: "",
    tone: "",
  };

  if (!category) return selected;

  const isMaterial = materials.some((material) => material.slug === category);
  const isApplication = applications.some((application) => application.slug === category);
  const isTone = TONE_OPTIONS.some((tone) => tone.slug === category);

  if (isMaterial) {
    selected.material = category;
  } else if (isApplication) {
    selected.application = category;
  } else if (isTone) {
    selected.tone = category;
  }

  return selected;
};

const collectApplicationLabels = (product: Product): string[] => {
  const seen = new Set<string>();
  const labels: string[] = [];

  product.applicationIndex.forEach((application) => {
    if (seen.has(application.label)) return;
    seen.add(application.label);
    labels.push(application.label);
  });

  return labels;
};

const hasActiveFilters = (filters: FilterState) =>
  Boolean(filters.query || filters.material || filters.application || filters.tone);

const emptyFilters = (): FilterState => ({
  query: "",
  material: "",
  application: "",
  tone: "",
});

const parseFiltersFromParams = (
  params: URLSearchParams,
  materials: { name: string; slug: string }[],
  applications: { name: string; slug: string }[]
): FilterState => {
  const selected = buildInitialFilters(
    params.get("category"),
    materials,
    applications
  );

  const query = params.get("q")?.trim() || "";
  const material = params.get("material") || selected.material;
  const application = params.get("application") || selected.application;
  const tone = params.get("tone") || selected.tone;

  return {
    query,
    material: materials.some((item) => item.slug === material) ? material : "",
    application: applications.some((item) => item.slug === application)
      ? application
      : "",
    tone: TONE_OPTIONS.some((item) => item.slug === tone) ? tone : "",
  };
};

const buildProductsQuery = (
  currentParams: URLSearchParams,
  filters: FilterState
): string => {
  const nextParams = new URLSearchParams(currentParams.toString());

  ["category", "q", "material", "application", "tone"].forEach((key) => {
    nextParams.delete(key);
  });

  const query = filters.query.trim();
  if (query) nextParams.set("q", query);
  if (filters.material) nextParams.set("material", filters.material);
  if (filters.application) nextParams.set("application", filters.application);
  if (filters.tone) nextParams.set("tone", filters.tone);

  return nextParams.toString();
};

const readProductsReturnContext = (): ProductsReturnContext | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(
      PRODUCTS_RETURN_CONTEXT_STORAGE_KEY
    );
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ProductsReturnContext>;
    if (
      typeof parsed.href !== "string" ||
      typeof parsed.productSlug !== "string" ||
      typeof parsed.scrollY !== "number" ||
      typeof parsed.savedAt !== "string"
    ) {
      return null;
    }

    return {
      href: parsed.href,
      productSlug: parsed.productSlug,
      scrollY: parsed.scrollY,
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
};

function FilterSelect({
  value,
  onValueChange,
  className,
  ariaLabel,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  className: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const isOpenRef = useRef(false);

  return (
    <select
      value={value}
      onMouseDown={(event) => {
        if (isOpenRef.current) {
          event.preventDefault();
          isOpenRef.current = false;
          event.currentTarget.blur();
          return;
        }
        isOpenRef.current = true;
      }}
      onBlur={() => {
        isOpenRef.current = false;
      }}
      onChange={(event) => {
        onValueChange(event.target.value);
        isOpenRef.current = false;
        event.currentTarget.blur();
      }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </select>
  );
}

type ProductsPageContentProps = {
  filters: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  enableReturnRestore?: boolean;
};

function ProductsPageContent({
  filters,
  onFiltersChange,
  enableReturnRestore = false,
}: ProductsPageContentProps) {
  const materials = PRODUCT_CATEGORIES.materials;
  const applications = useMemo(
    () =>
      PRODUCT_CATEGORIES.applications.map((application) => ({
        name: application.name,
        slug: application.slug,
      })),
    []
  );

  useEffect(() => {
    if (!enableReturnRestore) return;
    if (typeof window === "undefined") return;

    const context = readProductsReturnContext();
    if (!context) return;

    const currentHref = `${window.location.pathname}${window.location.search}`;
    const isCurrentList = context.href === currentHref;
    const ageMs = Date.now() - new Date(context.savedAt).getTime();
    const isFresh = Number.isFinite(ageMs) && ageMs < 30 * 60 * 1000;

    if (!isCurrentList || !isFresh) {
      window.sessionStorage.removeItem(PRODUCTS_RETURN_CONTEXT_STORAGE_KEY);
      return;
    }

    window.requestAnimationFrame(() => {
      const productCard = document.getElementById(
        `product-${context.productSlug}`
      );
      if (productCard) {
        productCard.scrollIntoView({ block: "center" });
      } else {
        window.scrollTo({ top: context.scrollY });
      }
      window.sessionStorage.removeItem(PRODUCTS_RETURN_CONTEXT_STORAGE_KEY);
    });
  }, [enableReturnRestore]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      if (filters.material && product.materialId !== filters.material) {
        return false;
      }

      if (filters.application) {
        const hasApplication = product.applicationIndex.some(
          (application) => application.categorySlug === filters.application
        );
        if (!hasApplication) {
          return false;
        }
      }

      if (filters.tone) {
        const override = PRODUCT_OVERRIDES[product.slug];
        const productTones = (override?.toneTags || []).map(slugifyTone);
        if (!productTones.includes(filters.tone)) {
          return false;
        }
      }

      if (!normalizedQuery) {
        return true;
      }

      const displayName = getProductDisplayName(product);
      const searchable = [
        displayName,
        product.name,
        product.materialName,
        ...collectApplicationLabels(product),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange?.({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange?.(emptyFilters());
  };

  const saveReturnContext = (productSlug: string) => {
    if (typeof window === "undefined") return;

    const context: ProductsReturnContext = {
      href: `${window.location.pathname}${window.location.search}`,
      productSlug,
      scrollY: window.scrollY,
      savedAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem(
        PRODUCTS_RETURN_CONTEXT_STORAGE_KEY,
        JSON.stringify(context)
      );
    } catch {
      // Navigation still works if session storage is unavailable.
    }
  };

  const productHref = (slug: string) => `/products/${slug}`;

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <section className="pt-28 sm:pt-32 lg:pt-36 pb-6 sm:pb-8 page-padding-x border-b border-[#E6E0D8]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-serif text-[clamp(1.7rem,4vw,2.75rem)] leading-[0.95] text-[#1D1D1B]">
              Stone Products
            </h1>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-gray-500">
              {filteredProducts.length} Results
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Quickly narrow by keyword, material, and application to find the right stone.
          </p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto page-padding-x py-5 sm:py-6">
        <div className="rounded-xl border border-[#E6E0D8] bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="flex flex-col gap-1.5 lg:col-span-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Search</span>
              <input
                type="text"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="Search by product or material"
                className="h-10 px-3 text-sm border border-[#D8D2C8] bg-white text-[#1D1D1B] placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Search products by name or material"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Material</span>
              <FilterSelect
                value={filters.material}
                onValueChange={(value) => updateFilter("material", value)}
                className="h-10 px-3 text-sm border border-[#D8D2C8] bg-white text-[#1D1D1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                ariaLabel="Filter by material"
              >
                <option value="">All Materials</option>
                {materials.map((material) => (
                  <option key={material.slug} value={material.slug}>
                    {material.name}
                  </option>
                ))}
              </FilterSelect>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Application</span>
              <FilterSelect
                value={filters.application}
                onValueChange={(value) => updateFilter("application", value)}
                className="h-10 px-3 text-sm border border-[#D8D2C8] bg-white text-[#1D1D1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                ariaLabel="Filter by application"
              >
                <option value="">All Applications</option>
                {applications.map((application) => (
                  <option key={application.slug} value={application.slug}>
                    {application.name}
                  </option>
                ))}
              </FilterSelect>
            </label>

            {TONE_OPTIONS.length > 0 && (
              <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Tone</span>
                <FilterSelect
                  value={filters.tone}
                  onValueChange={(value) => updateFilter("tone", value)}
                  className="h-10 px-3 text-sm border border-[#D8D2C8] bg-white text-[#1D1D1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  ariaLabel="Filter by tone"
                >
                  <option value="">All Tones</option>
                  {TONE_OPTIONS.map((tone) => (
                    <option key={tone.slug} value={tone.slug}>
                      {tone.name}
                    </option>
                  ))}
                </FilterSelect>
              </label>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {hasActiveFilters(filters) ? "Filters applied" : "No filters applied"}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters(filters)}
              className="inline-flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.14em] border border-[#D8D2C8] text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-600">
            No products match current filters.{" "}
            <button
              type="button"
              onClick={clearFilters}
              className="uppercase tracking-[0.14em] text-[11px] text-gray-900 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              const override = PRODUCT_OVERRIDES[product.slug];
              const displayName = getProductDisplayName(product);
              const imageUrl =
                override?.imageUrls?.[0] || override?.imageUrl || DEFAULT_PRODUCT_IMAGE;
              const applicationLabels = collectApplicationLabels(product);
              const visibleLabels = applicationLabels.slice(0, 2);
              const remainingLabelCount = Math.max(applicationLabels.length - visibleLabels.length, 0);

              return (
                <Link
                  id={`product-${product.slug}`}
                  key={product.id}
                  href={productHref(product.slug)}
                  onClick={() => saveReturnContext(product.slug)}
                  className="group block overflow-hidden border border-[#E6E0D8] bg-white hover:border-[#CDC5BA] hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)] transition-all"
                >
                  <div className="relative aspect-[5/4] bg-[#E5E5E5] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h2 className="font-serif text-[1.1rem] leading-tight text-[#1D1D1B] min-h-[2.35rem]">
                      {displayName}
                    </h2>

                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-500">
                      {product.materialName}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {visibleLabels.map((label) => (
                        <span
                          key={label}
                          className="px-2 py-1 text-[10px] uppercase tracking-[0.08em] bg-[#F2EEE8] text-[#4D4A44]"
                        >
                          {label}
                        </span>
                      ))}
                      {remainingLabelCount > 0 && (
                        <span className="px-2 py-1 text-[10px] uppercase tracking-[0.08em] bg-[#F2EEE8] text-[#4D4A44]">
                          +{remainingLabelCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function ProductsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const materials = PRODUCT_CATEGORIES.materials;
  const applications = useMemo(
    () =>
      PRODUCT_CATEGORIES.applications.map((application) => ({
        name: application.name,
        slug: application.slug,
      })),
    []
  );

  const urlFilters = useMemo(
    () =>
      parseFiltersFromParams(
        new URLSearchParams(searchParams.toString()),
        materials,
        applications
      ),
    [applications, materials, searchParams]
  );

  const handleFiltersChange = (nextFilters: FilterState) => {
    const query = buildProductsQuery(
      new URLSearchParams(searchParams.toString()),
      nextFilters
    );
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <ProductsPageContent
      filters={urlFilters}
      onFiltersChange={handleFiltersChange}
      enableReturnRestore
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageContent filters={emptyFilters()} />}>
      <ProductsPageInner />
    </Suspense>
  );
}
