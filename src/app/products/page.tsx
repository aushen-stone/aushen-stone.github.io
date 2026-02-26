import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Stone Products | Aushen Stone",
  description:
    "Browse Aushen Stone products by material, application, and finish to find the right stone for your project.",
  path: "/products/",
});

export default function ProductsPage() {
  return <ProductsPageClient />;
}
