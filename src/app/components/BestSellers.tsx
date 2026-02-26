"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { PRODUCTS } from "@/data/products.generated";
import {
  DEFAULT_PRODUCT_IMAGE,
  PRODUCT_OVERRIDES,
} from "@/data/product_overrides";
import type { Product } from "@/types/product";
import { FadeIn } from "./animations/FadeIn";

const PREFERRED_BEST_SELLER_SLUGS = [
  "blueocean",
  "grey-apricot",
  "silver-ash",
] as const;

type BestSellerCard = {
  id: string;
  slug: string;
  name: string;
  materialName: string;
  imageUrl: string;
};

const toCard = (product: Product): BestSellerCard => {
  const override = PRODUCT_OVERRIDES[product.slug];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    materialName: product.materialName,
    imageUrl:
      override?.imageUrls?.[0] ||
      override?.imageUrl ||
      DEFAULT_PRODUCT_IMAGE,
  };
};

const hasRealImage = (product: Product): boolean => {
  const override = PRODUCT_OVERRIDES[product.slug];
  return Boolean(override?.imageUrls?.[0] || override?.imageUrl);
};

const buildBestSellers = (): BestSellerCard[] => {
  const bySlug = new Map(PRODUCTS.map((product) => [product.slug, product]));
  const selected: Product[] = [];
  const selectedSlugs = new Set<string>();

  PREFERRED_BEST_SELLER_SLUGS.forEach((slug) => {
    const product = bySlug.get(slug);
    if (!product || selectedSlugs.has(product.slug)) return;
    selected.push(product);
    selectedSlugs.add(product.slug);
  });

  const withRealImage = PRODUCTS.filter(
    (product) => !selectedSlugs.has(product.slug) && hasRealImage(product)
  );
  withRealImage.forEach((product) => {
    if (selected.length >= 3) return;
    selected.push(product);
    selectedSlugs.add(product.slug);
  });

  PRODUCTS.forEach((product) => {
    if (selected.length >= 3 || selectedSlugs.has(product.slug)) return;
    selected.push(product);
    selectedSlugs.add(product.slug);
  });

  return selected.slice(0, 3).map(toCard);
};

const BEST_SELLERS = buildBestSellers();

const smoothEase: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase },
  }
};

export function BestSellers() {
  return (
    <section className="py-16 sm:py-24 page-padding-x bg-white">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr] gap-10 sm:gap-16 lg:gap-24">
        <FadeIn className="flex flex-col justify-center items-start space-y-8">
          <div>
            <h2 className="font-serif display-lg text-[#1a1a1a] mb-5 sm:mb-6">
              Best sellers
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Explore three of our real, high-demand stone products.
            </p>
          </div>

          <Link
            href="/products"
            className="group relative inline-block text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] font-medium text-gray-900 pb-2 border-b border-gray-300 hover:border-gray-900 transition-colors cursor-pointer"
          >
            Shop Best Sellers
          </Link>
        </FadeIn>

        <div className="relative">
          <div className="absolute -top-10 sm:-top-12 right-0 hidden sm:flex gap-4 text-gray-400">
             <ChevronLeft size={20} className="cursor-pointer hover:text-gray-900 transition-colors" />
             <ChevronRight size={20} className="cursor-pointer hover:text-gray-900 transition-colors" />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {BEST_SELLERS.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pb-6 sm:pb-8">
                      <span className="bg-black text-white text-[10px] uppercase tracking-[0.14em] sm:tracking-widest px-5 sm:px-6 py-3 hover:bg-gray-800 transition-colors">
                        View Product
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-900 font-medium">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.materialName}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
