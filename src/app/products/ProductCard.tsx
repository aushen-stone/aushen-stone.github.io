/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { getProductDisplayName } from "@/data/product_display_names";
import {
  DEFAULT_PRODUCT_THUMBNAIL,
  PRODUCT_OVERRIDES,
} from "@/data/product_overrides";
import type { Product } from "@/types/product";

export const collectApplicationLabels = (product: Product): string[] => {
  const seen = new Set<string>();
  const labels: string[] = [];

  product.applicationIndex.forEach((application) => {
    if (seen.has(application.label)) return;
    seen.add(application.label);
    labels.push(application.label);
  });

  return labels;
};

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect?: (slug: string) => void;
}) {
  const [hoverImageRequested, setHoverImageRequested] = useState(false);
  const override = PRODUCT_OVERRIDES[product.slug];
  const displayName = getProductDisplayName(product);
  const imageUrl =
    override?.imageThumbnailUrl ||
    override?.imageUrl ||
    override?.imageUrls?.[0] ||
    DEFAULT_PRODUCT_THUMBNAIL;
  const applicationHoverUrl =
    override?.applicationThumbnailUrls?.[0] ||
    override?.applicationImageUrls?.[0];
  const visibleLabels = collectApplicationLabels(product).slice(0, 2);

  return (
    <Link
      id={`product-${product.slug}`}
      href={`/products/${product.slug}/`}
      onClick={() => onSelect?.(product.slug)}
      onMouseEnter={() => setHoverImageRequested(true)}
      className="group block overflow-hidden border border-[#E6E0D8] bg-white transition-all hover:border-[#CDC5BA] hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#E5E5E5]">
        <img
          src={imageUrl}
          alt={displayName}
          width={800}
          height={640}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] ${applicationHoverUrl ? "group-hover:opacity-0" : ""}`}
        />
        {applicationHoverUrl && hoverImageRequested ? (
          <img
            src={applicationHoverUrl}
            alt={`${displayName} application`}
            width={800}
            height={640}
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        ) : null}
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="min-h-[2.35rem] font-serif text-[1.1rem] leading-tight text-[#1D1D1B]">
          {displayName}
        </h2>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-500">
          {product.materialName}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleLabels.map((label) => (
            <span
              key={label}
              className="bg-[#F2EEE8] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#4D4A44]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
