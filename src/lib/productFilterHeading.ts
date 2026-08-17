type ProductFilterHeadingInput = {
  material?: string;
  application?: string;
  tone?: string;
};

export const buildProductFilterHeading = ({
  material,
  application,
  tone,
}: ProductFilterHeadingInput): string =>
  [material, application, tone].filter(Boolean).join(" & ") || "Stone Products";
