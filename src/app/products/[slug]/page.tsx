import { PRODUCTS } from "@/data/products.generated";
import ProductDetailClient from "./ProductDetailClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return <ProductDetailClient slug={slug} />;
}
