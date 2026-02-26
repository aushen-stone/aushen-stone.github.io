import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projects | Aushen Stone",
  description:
    "Explore selected residential and commercial natural stone projects delivered with Aushen Stone products.",
  path: "/projects/",
});

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
