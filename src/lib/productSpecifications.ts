import type {
  ApplicationFinishOffer,
  ApplicationIndexEntry,
  Product,
} from "@/types/product";

export type ProductTechnicalSpecification = {
  label: "Material" | "Application" | "Finish" | "Size" | "Slip Rating";
  value: string;
};

const TRAILING_SLIP_RATING = /\s*\(([^()]+)\)\s*$/;

/**
 * Supports both current CMS data (a dedicated slipRating field) and legacy
 * finish names such as "Sandblasted (P5)".
 */
export function resolveFinishSpecification(
  finish: Pick<ApplicationFinishOffer, "name" | "slipRating"> | undefined,
): { name: string; slipRating: string } {
  if (!finish) return { name: "-", slipRating: "-" };

  const rawName = finish.name.trim();
  const match = rawName.match(TRAILING_SLIP_RATING);
  const name = (match ? rawName.slice(0, match.index).trim() : rawName) || "-";
  const slipRating = finish.slipRating?.trim() || match?.[1]?.trim() || "-";

  return { name, slipRating };
}

export function formatSurfaceFinishLabel(
  finish: Pick<ApplicationFinishOffer, "name" | "slipRating">,
): string {
  const resolved = resolveFinishSpecification(finish);
  return resolved.slipRating === "-"
    ? resolved.name
    : `${resolved.name} (${resolved.slipRating})`;
}

export function joinApplicationLabels(
  applications: ReadonlyArray<Pick<ApplicationIndexEntry, "label">>,
): string {
  const labels = Array.from(
    new Set(applications.map(({ label }) => label.trim()).filter(Boolean)),
  );
  return labels.length > 0
    ? labels.join(", ")
    : "Application details coming soon.";
}

export function buildProductTechnicalSpecifications({
  product,
  application,
  finish,
  size,
}: {
  product: Pick<Product, "materialName">;
  application: Pick<ApplicationIndexEntry, "label"> | undefined;
  finish: Pick<ApplicationFinishOffer, "name" | "slipRating"> | undefined;
  size: string;
}): ProductTechnicalSpecification[] {
  const resolvedFinish = resolveFinishSpecification(finish);

  return [
    { label: "Material", value: product.materialName || "-" },
    { label: "Application", value: application?.label || "-" },
    { label: "Finish", value: resolvedFinish.name },
    { label: "Size", value: size || "-" },
    { label: "Slip Rating", value: resolvedFinish.slipRating },
  ];
}
