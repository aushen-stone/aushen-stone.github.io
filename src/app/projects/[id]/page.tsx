import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamicParams = false;

const STATIC_PROJECT_IDS = [
  "brighton-residence",
  "toorak-pool-house",
  "mornington-peninsula-winery",
  "hawthorn-courtyard",
  "sorrento-coastal-home",
] as const;

const PROJECT_TITLES: Record<(typeof STATIC_PROJECT_IDS)[number], string> = {
  "brighton-residence": "Brighton Residence",
  "toorak-pool-house": "Toorak Pool House",
  "mornington-peninsula-winery": "Mornington Peninsula Winery",
  "hawthorn-courtyard": "Hawthorn Courtyard",
  "sorrento-coastal-home": "Sorrento Coastal Home",
};

export function generateStaticParams() {
  return STATIC_PROJECT_IDS.map((id) => ({ id }));
}

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectTitle = PROJECT_TITLES[id as keyof typeof PROJECT_TITLES] ?? "Project";

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
