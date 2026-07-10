import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";
import { buildMetadata } from "@/lib/seo";
import { ManagedPageRenderer } from "@/app/components/ManagedPageRenderer";
import { getManagedPage } from "@/data/siteContent";

export const metadata: Metadata = buildMetadata({
  title: "Stone Services | Aushen Stone",
  description:
    "Discover Aushen Stone services including edge profiling, custom cutting, design consultation, and project delivery support.",
  path: "/services/",
});

export default function ServicesPage() {
  const managedPage = getManagedPage("services");
  if (managedPage) return <ManagedPageRenderer page={managedPage} />;
  return <ServicesPageClient />;
}
