import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products.generated";
import {
  DEFAULT_PRODUCT_DESCRIPTION,
  PRODUCT_OVERRIDES,
} from "@/data/product_overrides";
import { buildMetadata } from "@/lib/seo";
import ProductDetailClient from "./ProductDetailClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    return buildMetadata({
      title: "Product Not Found | Aushen Stone",
      description: "The requested product page is not available.",
      path: `/products/${slug}/`,
      index: false,
      follow: false,
    });
  }

  const override = PRODUCT_OVERRIDES[product.slug];
  const description =
    override?.description ||
    `${product.name} in ${product.materialName}, curated by Aushen Stone for architectural and landscape applications. ${DEFAULT_PRODUCT_DESCRIPTION}`;

  return buildMetadata({
    title: `${product.name} | ${product.materialName} | Aushen Stone`,
    description,
    path: `/products/${product.slug}/`,
    index: true,
    follow: true,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return <ProductDetailClient slug={slug} />;
}
