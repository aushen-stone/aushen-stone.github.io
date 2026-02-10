import ProjectDetailClient from "./ProjectDetailClient";

export const dynamicParams = false;

const STATIC_PROJECT_IDS = [
  "brighton-residence",
  "toorak-pool-house",
  "mornington-peninsula-winery",
  "hawthorn-courtyard",
  "sorrento-coastal-home",
] as const;

export function generateStaticParams() {
  return STATIC_PROJECT_IDS.map((id) => ({ id }));
}

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  return <ProjectDetailClient id={id} />;
}
