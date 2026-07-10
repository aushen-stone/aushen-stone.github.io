import { getProductDisplayNameBySlug } from "@/data/product_display_names";
import {
  MAX_SAMPLE_LINES,
  SAMPLE_SIZE,
  type SampleCartLine,
} from "@/types/cart";

export function isSampleCartLine(value: unknown): value is SampleCartLine {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.productSlug === "string" &&
    typeof candidate.productName === "string" &&
    typeof candidate.finishId === "string" &&
    typeof candidate.finishName === "string" &&
    candidate.sampleSize === SAMPLE_SIZE &&
    typeof candidate.addedAt === "string"
  );
}

export function hydrateSampleCart(value: unknown): SampleCartLine[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isSampleCartLine)
    .slice(0, MAX_SAMPLE_LINES)
    .map((line) => {
      const productName = getProductDisplayNameBySlug(
        line.productSlug,
        line.productName
      );

      return productName === line.productName ? line : { ...line, productName };
    });
}

export function buildSampleContactPrefill(lines: SampleCartLine[]): string {
  if (lines.length === 0) return "";

  const sampleLabel = lines.length === 1 ? "a sample" : "samples";
  const rows = lines
    .map(
      (line, index) =>
        `${index + 1}. ${line.productName} - ${line.finishName} (${line.sampleSize})`
    )
    .join("\n");

  return [
    "Hi Aushen team,",
    "",
    `Can I please get ${sampleLabel} for the following:`,
    rows,
    "",
    "Project suburb/address:",
    "Preferred delivery or consultation timing:",
    "Best contact time:",
    "",
    "Thank you.",
  ].join("\n");
}
