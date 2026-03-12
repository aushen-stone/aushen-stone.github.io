export type BlogCategoryRef = {
  name: string;
  slug: string;
};

export type BlogCategory = BlogCategoryRef & {
  count: number;
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPost = {
  title: string;
  slug: string;
  publishedAt: string;
  author: string;
  categories: BlogCategoryRef[];
  primaryCategory: BlogCategoryRef | null;
  heroImageUrl?: string | null;
  excerpt: string;
  bodyHtml: string;
  headings: BlogHeading[];
  readingTimeMinutes: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type BlogPostPreview = Pick<
  BlogPost,
  | "title"
  | "slug"
  | "publishedAt"
  | "categories"
  | "primaryCategory"
  | "heroImageUrl"
  | "excerpt"
  | "readingTimeMinutes"
>;
