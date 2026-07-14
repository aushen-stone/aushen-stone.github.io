import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Stone Services | Aushen Stone",
  description:
    "Discover Aushen Stone services including edge profiling, custom cutting, design consultation, and project delivery support.",
  path: "/services/",
});

export default function ServicesPage() {
  return <ServicesPageClient />;
}
