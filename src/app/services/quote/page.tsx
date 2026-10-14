import type { Metadata } from "next";
import ServicesQuotePageClient from "./ServicesQuotePageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Stone Fabrication Quote | Aushen Stone",
  description:
    "Request a stone fabrication or cutting quote from Aushen Stone. Send your stone, dimensions, quantity and timing and our Melbourne team will come back to you.",
  path: "/services/quote/",
});

export default function ServicesQuotePage() {
  return <ServicesQuotePageClient />;
}
