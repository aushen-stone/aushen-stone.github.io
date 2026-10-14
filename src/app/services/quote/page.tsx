import type { Metadata } from "next";
import ServicesQuoteRedirect from "./ServicesQuoteRedirect";
import { buildMetadata } from "@/lib/seo";

// /services/quote/ was briefly a standalone page; the quote form now lives in a
// dialog on /services. Keep the URL working for old links and cached tabs.
export const metadata: Metadata = buildMetadata({
  title: "Stone Fabrication Quote | Aushen Stone",
  description: "Request a stone fabrication or cutting quote from Aushen Stone.",
  path: "/services/quote/",
  index: false,
  follow: true,
});

export default function ServicesQuotePage() {
  return <ServicesQuoteRedirect />;
}
