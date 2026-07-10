export type CmsStatus = "draft" | "published";
export type CmsEntityType = "products" | "blog";

export type CmsRow = {
  id: string;
  slug: string;
  title: string;
  status: CmsStatus;
  imageUrl: string | null;
  secondaryLabel: string;
  content: Record<string, unknown>;
  updatedAt: string;
};
