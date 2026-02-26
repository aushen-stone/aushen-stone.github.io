import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sample Cart | Aushen Stone",
  description: "Review selected stone samples and submit a consolidated sample request.",
  path: "/cart/",
  index: false,
  follow: true,
});

export default function CartPage() {
  return <CartPageClient />;
}
