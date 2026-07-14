export type CmsStatus = "draft" | "published";
export type CmsEntityType =
  | "products"
  | "blog"
  | "projects"
  | "home"
  | "services"
  | "about";

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
