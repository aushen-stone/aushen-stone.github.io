import type { Metadata } from "next";
import { AccessoriesIndexPageClient } from "./AccessoriesIndexPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Accessories | Aushen Stone",
  description:
    "Explore Chemforce, HIDE, and FormBoss accessories curated by Aushen Stone for sealing, access covers, edging, and landscape detailing.",
  path: "/accessories/",
});

export default function AccessoriesPage() {
  return <AccessoriesIndexPageClient />;
}
