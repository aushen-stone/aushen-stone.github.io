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

// Page-specific CMS data intentionally mirrors the existing components. This
// prevents content editing from replacing the public site with a generic page
// renderer and keeps every legacy class name and animation in place.
export type LegacyHomeContent = {
  hero?: { titleLines: string[]; text: string; image: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  brand?: { text: string; logo: string };
  projectShowcase?: { titlePrefix: string; titleEmphasis: string; titleSuffix: string; text: string; image: string; linkLabel: string; linkHref: string };
  accessories?: { eyebrow: string; heading: string; text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string; items: Record<string, { eyebrow: string; blurb: string; note: string }> };
  services?: { heading: string; introPrefix: string; introEmphasis: string; introSuffix: string; items: Array<{ id: number; title: string; description: string; image: string; icon: "scan" | "layers" | "users" }> };
  creativeHub?: { marquee: string; images: Array<{ src: string; alt: string }>; audiences: Array<{ title: string; lead: string; text: string; label: string; href: string }> };
};

export type LegacyServicesContent = {
  hero?: { eyebrow: string; title: string; emphasis: string; text: string };
  fabrication?: { eyebrow: string; heading: string; items: Array<{ id: string; title: string; description: string; features: string[]; image: string }> };
  consultation?: { image: string; imageAlt: string; quote: string; eyebrow: string; heading: string; text: string; label: string; href: string };
  logistics?: { heading: string; stepLabel: string; items: Array<{ title: string; text: string; icon: "network" | "logistics" | "support" }> };
  cta?: { heading: string; text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
};

export type LegacyAboutContent = {
  hero?: { eyebrow: string; title: string; emphasis: string; text: string; image: string; scrollLabel: string };
  timeline?: Array<{ year: string; title: string; desc: string; image: string; align: "left" | "right" }>;
  manifesto?: { quote: string; label: string };
  signature?: { quote: string };
};

export type LegacyPageContentMap = {
  home?: LegacyHomeContent;
  services?: LegacyServicesContent;
  about?: LegacyAboutContent;
};

export type ProjectGalleryItem = { type: "full" | "half"; src: string; alt: string };
export type ProjectProduct = { name: string; category: string; image: string; slug: string };

export type ManagedProject = {
  // Legacy project cards use a numeric display key. Keep it optional so newly
  // created CMS projects can rely on their slug while migrated records remain
  // type-safe after the static sync.
  id?: number;
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
