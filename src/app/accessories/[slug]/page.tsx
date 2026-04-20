import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ACCESSORY_BRANDS, getAccessoryBrandBySlug } from "@/data/accessories";
import { AccessoryBrandPageRenderer } from "../AccessoryBrandPageRenderer";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ACCESSORY_BRANDS.map((brand) => ({ slug: brand.slug }));
}

type AccessoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AccessoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getAccessoryBrandBySlug(slug);

  if (!brand) {
    return buildMetadata({
      title: "Accessory Page Not Found | Aushen Stone",
      description: "The requested accessories page is not available.",
      path: `/accessories/${slug}/`,
      index: false,
      follow: false,
    });
  }

  return buildMetadata({
    title: brand.seoTitle,
    description: brand.seoDescription,
    path: brand.route,
  });
}

export default async function AccessoryDetailPage({
  params,
}: AccessoryDetailPageProps) {
  const { slug } = await params;
  const brand = getAccessoryBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return <AccessoryBrandPageRenderer brand={brand} />;
}
