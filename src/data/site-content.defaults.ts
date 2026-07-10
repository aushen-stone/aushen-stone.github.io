import type { ManagedPage, ManagedProject } from "@/types/siteContent";

export const DEFAULT_MANAGED_PAGES: Record<ManagedPage["key"], ManagedPage> = {
  home: {
    key: "home",
    title: "Home",
    heroImageUrl: "/AushenShop.webp",
    blocks: [
      { id: "home-hero", type: "hero", title: "Find your crafted architectural surfaces.", text: "Natural stone, paving, pool coping and wall cladding advice from the Aushen showroom team.", imageUrl: "/AushenShop.webp", dark: true },
      { id: "home-story", type: "text", title: "Crafted by nature, curated by Aushen.", text: "We source architectural surfaces with character, consistency and enduring material integrity." },
      { id: "home-cta", type: "cta", title: "Start your material selection", text: "Visit the showroom or talk with a stone specialist.", label: "Contact us", href: "/contact/" },
    ],
  },
  services: {
    key: "services",
    title: "Services",
    heroImageUrl: "/task-a-2026-02-24/svc-profiling.webp",
    blocks: [
      { id: "services-hero", type: "hero", title: "Beyond the stone", text: "We craft, customise and curate natural stone to fit your project.", imageUrl: "/task-a-2026-02-24/svc-profiling.webp", dark: true },
      { id: "services-cards", type: "cards", title: "Precision fabrication", items: [
        { title: "Edge Profiling", text: "Bullnose, pencil edges, drop faces and mitred aprons.", imageUrl: "/task-a-2026-02-24/svc-profiling.webp" },
        { title: "Curved Cutting", text: "Precise radius cutting and template matching.", imageUrl: "/task-a-2026-02-24/svc-curved.webp" },
        { title: "Bespoke Custom", text: "Core drilling, cut-outs and custom modifications.", imageUrl: "/task-a-2026-02-24/svc-bespoke.webp" },
      ] },
      { id: "services-cta", type: "cta", title: "Ready to begin?", text: "Discuss your project with our showroom team.", label: "Book a consultation", href: "/contact/" },
    ],
  },
  about: {
    key: "about",
    title: "Our Story",
    heroImageUrl: "/task-a-2026-02-24/about-hero-quarry.webp",
    blocks: [
      { id: "about-hero", type: "hero", title: "The Stone Keeper.", text: "Curators of geology, bridging the ancient quarry and the modern home.", imageUrl: "/task-a-2026-02-24/about-hero-quarry.webp" },
      { id: "about-origin", type: "text", title: "Material origins", text: "We select stone for authenticity, performance and architectural character." },
      { id: "about-values", type: "cards", title: "Our standard", items: [
        { title: "Responsible sourcing", text: "Long-term supplier relationships and considered material selection." },
        { title: "Local expertise", text: "Showroom guidance, processing and project support in Melbourne." },
        { title: "Quality control", text: "Careful review of tone, finish and dimensional consistency." },
      ] },
    ],
  },
};

const SHARED_GALLERY = [
  { type: "full" as const, src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop", alt: "Wide project view" },
  { type: "half" as const, src: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop", alt: "Stone detail" },
  { type: "half" as const, src: "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=1200&auto=format&fit=crop", alt: "Paving detail" },
];

const PROJECT_SEEDS: Array<[string, string, string, string, string, string, ManagedProject["gridArea"]]> = [
  ["brighton-residence", "Brighton Residence", "Residential", "Brighton, Victoria", "2023", "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop", "left"],
  ["toorak-pool-house", "Toorak Pool House", "Landscape", "Toorak, Victoria", "2022", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop", "right"],
  ["mornington-peninsula-winery", "Mornington Peninsula Winery", "Commercial", "Mornington, Victoria", "2021", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop", "left"],
  ["hawthorn-courtyard", "Hawthorn Courtyard", "Residential", "Hawthorn, Victoria", "2020", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", "right"],
  ["sorrento-coastal-home", "Sorrento Coastal Home", "Residential", "Sorrento, Victoria", "2024", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop", "center"],
];

export const DEFAULT_MANAGED_PROJECTS: ManagedProject[] = PROJECT_SEEDS.map(([slug, title, category, location, year, image, gridArea]) => ({
  slug, title, category, location, year, image, gridArea,
  aspect: "aspect-[16/10]",
  tags: [category],
  credits: { architect: "Aushen project partner", builder: "Project builder", landscaper: "Landscape partner", photographer: "Project photographer" },
  description: `${title} demonstrates a considered use of natural stone across architecture and landscape.`,
  gallery: SHARED_GALLERY.map((item, index) => index === 0 ? { ...item, src: image } : item),
  products: [],
}));
