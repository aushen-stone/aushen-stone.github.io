export type ManagedPageKey = "home" | "services" | "about";

export type PageBlock =
  | { id: string; type: "hero"; title: string; text?: string; imageUrl?: string; dark?: boolean }
  | { id: string; type: "text"; title: string; text: string }
  | { id: string; type: "cards"; title: string; items: Array<{ title: string; text: string; imageUrl?: string }> }
  | { id: string; type: "gallery"; title: string; images: Array<{ src: string; alt: string }> }
  | { id: string; type: "cta"; title: string; text?: string; label: string; href: string };

export type ManagedPage = {
  key: ManagedPageKey;
  title: string;
  heroImageUrl?: string | null;
  blocks: PageBlock[];
};

export type ProjectGalleryItem = { type: "full" | "half"; src: string; alt: string };
export type ProjectProduct = { name: string; category: string; image: string; slug: string };

export type ManagedProject = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  aspect: string;
  gridArea: "left" | "right" | "center";
  tags: string[];
  credits: { architect: string; builder: string; landscaper: string; photographer: string };
  description: string;
  gallery: ProjectGalleryItem[];
  products: ProjectProduct[];
};
