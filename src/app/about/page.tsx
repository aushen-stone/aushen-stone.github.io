import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Aushen Stone | Our Story",
  description:
    "Learn about Aushen Stone's story, sourcing philosophy, and commitment to premium natural stone for residential and commercial projects.",
  path: "/about/",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
