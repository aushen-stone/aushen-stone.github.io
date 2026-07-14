import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ProjectDetailClient from "./ProjectDetailClient";
import { MANAGED_PROJECTS } from "@/data/siteContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return MANAGED_PROJECTS.map((project) => ({ id: project.slug }));
}

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectTitle = MANAGED_PROJECTS.find((project) => project.slug === id)?.title ?? "Project";

  return buildMetadata({
    title: `${projectTitle} | Projects | Aushen Stone`,
    description:
      "Selected natural stone project showcase by Aushen Stone. This detail page is currently excluded from indexing while project content is being finalized.",
    path: `/projects/${id}/`,
    index: false,
    follow: true,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  return <ProjectDetailClient id={id} />;
}
