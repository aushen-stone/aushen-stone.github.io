"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { PRODUCTS } from "@/data/products";
import {
  MATERIAL_FILTER_OPTIONS,
  buildApplicationFilterOptions,
} from "@/data/productFilterOptions";
import { SEO_LANDING_PAGES } from "@/data/seoLandingPages";
import { getProductDisplayName } from "@/data/product_display_names";
import { PRODUCT_OVERRIDES } from "@/data/product_overrides";
import { buildProductFilterHeading } from "@/lib/productFilterHeading";
import { ProductCard, collectApplicationLabels } from "@/app/products/ProductCard";
import {
  PRODUCTS_RETURN_CONTEXT_STORAGE_KEY,
  type ProductsReturnContext,
} from "@/types/productNavigation";

type FilterState = {
  query: string;
  materials: string[];
  applications: string[];
  tone: string;
};

const APPLICATION_FILTER_OPTIONS = buildApplicationFilterOptions(PRODUCTS);

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
  materials: ReadonlyArray<{ name: string; slug: string }>,
  applications: ReadonlyArray<{ name: string; slug: string }>
): FilterState => {
  const selected: FilterState = {
    query: "",
    materials: [],
    applications: [],
    tone: "",
  };

  if (!category) return selected;

  const isMaterial = materials.some((material) => material.slug === category);
  const isApplication = applications.some((application) => application.slug === category);
  const isTone = TONE_OPTIONS.some((tone) => tone.slug === category);

  if (isMaterial) {
    selected.materials = [category];
  } else if (isApplication) {
    selected.applications = [category];
  } else if (isTone) {
    selected.tone = category;
  }

  return selected;
};

const hasActiveFilters = (filters: FilterState) =>
  Boolean(filters.query || filters.materials.length || filters.applications.length || filters.tone);

const emptyFilters = (): FilterState => ({
  query: "",
  materials: [],
  applications: [],
  tone: "",
});

const parseFiltersFromParams = (
  params: URLSearchParams,
  materials: ReadonlyArray<{ name: string; slug: string }>,
  applications: ReadonlyArray<{ name: string; slug: string }>
): FilterState => {
  const selected = buildInitialFilters(
    params.get("category"),
    materials,
    applications
  );

  const query = params.get("q")?.trim() || "";
  const materialValues = params.getAll("material");
  const applicationValues = params.getAll("application");
  const selectedMaterials = materialValues.length ? materialValues : selected.materials;
  const selectedApplications = applicationValues.length ? applicationValues : selected.applications;
  const tone = params.get("tone") || selected.tone;

  return {
    query,
    materials: Array.from(new Set(selectedMaterials)).filter((value) =>
      materials.some((item) => item.slug === value)
    ),
    applications: Array.from(new Set(selectedApplications)).filter((value) =>
      applications.some((item) => item.slug === value)
    ),
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
  filters.materials.forEach((material) => nextParams.append("material", material));
  filters.applications.forEach((application) => nextParams.append("application", application));
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

function MultiSelectFilter({
  values,
  onValuesChange,
  options,
  allLabel,
  selectedLabel,
  ariaLabel,
}: {
  values: string[];
  onValuesChange: (values: string[]) => void;
  options: ReadonlyArray<{ name: string; slug: string }>;
  allLabel: string;
  selectedLabel: string;
  ariaLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(values);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValues(values);
  }, [values]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const buttonLabel = selectedValues.length === 0
    ? allLabel
    : selectedValues.length === 1
      ? options.find((option) => option.slug === selectedValues[0])?.name || selectedLabel
      : `${selectedValues.length} ${selectedLabel}`;

  const toggleValue = (value: string) => {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selected) => selected !== value)
      : [...selectedValues, value];
    setSelectedValues(nextValues);
    onValuesChange(nextValues);
  };

  const clearValues = () => {
    setSelectedValues([]);
    onValuesChange([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 w-full items-center justify-between border border-[#D8D2C8] bg-white px-3 text-left text-sm text-[#1D1D1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={isOpen}>
        <span className="truncate">{buttonLabel}</span>
        <svg className={`ml-2 h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div role="listbox" aria-label={`${ariaLabel} options`} aria-multiselectable="true"
          className="absolute z-30 mt-1 max-h-72 w-full min-w-[220px] overflow-y-auto border border-[#D8D2C8] bg-white py-1 shadow-lg">
          <button type="button" role="option" aria-selected={selectedValues.length === 0}
            onClick={clearValues}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F8F5F1] focus-visible:outline-none focus-visible:bg-[#F8F5F1]">
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center border ${selectedValues.length === 0 ? "border-[#1a1c18] bg-[#1a1c18] text-white" : "border-[#B8B1A7]"}`}>
              {selectedValues.length === 0 && <span aria-hidden="true">✓</span>}
            </span>
            {allLabel}
          </button>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.slug);
            return (
              <button key={option.slug} type="button" role="option" aria-selected={isSelected}
                onClick={() => toggleValue(option.slug)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F8F5F1] focus-visible:outline-none focus-visible:bg-[#F8F5F1]">
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center border ${isSelected ? "border-[#1a1c18] bg-[#1a1c18] text-white" : "border-[#B8B1A7]"}`}>
                  {isSelected && <span aria-hidden="true">✓</span>}
                </span>
                {option.name}
              </button>
            );
          })}
          <div className="sticky bottom-0 border-t border-[#E6E0D8] bg-white p-2">
            <button type="button" onClick={() => setIsOpen(false)}
              className="w-full bg-[#1a1c18] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
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
  const materials = MATERIAL_FILTER_OPTIONS;
  const applications = APPLICATION_FILTER_OPTIONS;

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
      if (filters.materials.length > 0 && !filters.materials.includes(product.materialId)) {
        return false;
      }

      if (filters.applications.length > 0) {
        const hasApplication = product.applicationIndex.some(
          (application) => filters.applications.includes(application.categorySlug)
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
    }).sort((left, right) =>
      getProductDisplayName(left).localeCompare(getProductDisplayName(right), "en-AU", {
        sensitivity: "base",
        numeric: true,
      })
    );
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

  const selectedMaterialName = filters.materials.length === 1
    ? materials.find((material) => material.slug === filters.materials[0])?.name
    : undefined;
  const selectedApplicationName = filters.applications.length === 1
    ? applications.find((application) => application.slug === filters.applications[0])?.name
    : undefined;
  const selectedToneName = TONE_OPTIONS.find((tone) => tone.slug === filters.tone)?.name;
  const filterHeading = buildProductFilterHeading({
    material: selectedMaterialName,
    application: selectedApplicationName,
    tone: selectedToneName,
  });
  const selectedSeoPage = filters.materials.length === 1 && filters.applications.length === 0
    ? SEO_LANDING_PAGES.find((page) => page.kind === "material" && page.slug === filters.materials[0])
    : filters.applications.length === 1 && filters.materials.length === 0
      ? SEO_LANDING_PAGES.find((page) => page.kind === "application" && (
          page.slug === filters.applications[0] ||
          (page.slug === "cobblestone" && filters.applications[0] === "cobble-stone") ||
          (page.slug === "crazy-paving" && filters.applications[0] === "crazy-paver") ||
          (page.slug === "pavers" && filters.applications[0] === "paver")
        ))
      : undefined;
  const catalogueDescription = selectedSeoPage?.catalogueDescription?.trim() ||
    selectedSeoPage?.intro?.trim() ||
    "Quickly narrow by keyword, material, and application to find the right stone.";

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <section className="pt-28 sm:pt-32 lg:pt-36 pb-6 sm:pb-8 page-padding-x border-b border-[#E6E0D8]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-serif text-[clamp(1.7rem,4vw,2.75rem)] leading-[0.95] text-[#1D1D1B]">
              {filterHeading}
            </h1>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-gray-500">
              {filteredProducts.length} Results
            </p>
          </div>
          <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-6 text-gray-600">
            {catalogueDescription}
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

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Material</span>
              <MultiSelectFilter
                values={filters.materials}
                onValuesChange={(values) => updateFilter("materials", values)}
                options={materials} allLabel="All Materials" selectedLabel="Materials"
                ariaLabel="Filter by material"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Application</span>
              <MultiSelectFilter
                values={filters.applications}
                onValuesChange={(values) => updateFilter("applications", values)}
                options={applications} allLabel="All Applications" selectedLabel="Applications"
                ariaLabel="Filter by application"
              />
            </div>

            {TONE_OPTIONS.length > 0 && (
              <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Tone</span>
                <select
                  value={filters.tone}
                  onChange={(event) => updateFilter("tone", event.target.value)}
                  className="h-10 px-3 text-sm border border-[#D8D2C8] bg-white text-[#1D1D1B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Filter by tone"
                >
                  <option value="">All Tones</option>
                  {TONE_OPTIONS.map((tone) => (
                    <option key={tone.slug} value={tone.slug}>
                      {tone.name}
                    </option>
                  ))}
                </select>
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={saveReturnContext}
              />
            ))}
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
  const materials = MATERIAL_FILTER_OPTIONS;
  const applications = APPLICATION_FILTER_OPTIONS;

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
