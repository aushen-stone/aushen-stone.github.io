import type { LegacyPageContentMap } from "@/types/siteContent";

// These values are a structured copy of the pre-CMS website. Seeding them must
// therefore produce the same public copy and media as the rollback baseline.
export const DEFAULT_LEGACY_PAGES: Required<LegacyPageContentMap> = {
  home: {
    hero: {
      titleLines: ["Find your crafted", "architectural surfaces."],
      text: "Natural stone, paving, pool coping and wall cladding advice from the Aushen showroom team.",
      image: "/AushenShop.webp",
      primaryLabel: "Talk to a Stone Specialist",
      primaryHref: "/contact/",
      secondaryLabel: "Browse Products",
      secondaryHref: "/products/",
    },
    brand: {
      logo: "/AushenLogoLetterS.webp",
      text: "At Aushen, we craft and curate only the best natural stone, architectural surfaces and outdoor furniture. We celebrate the imperfections and textural richness that can only be found in nature.",
    },
    services: {
      heading: "What we do",
      introPrefix: "At Aushen, we do ",
      introEmphasis: "more",
      introSuffix: " than just sell stone and tiles.",
      items: [
        { id: 1, title: "Templating Service", description: "Precision digital templating for perfect fits.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop", icon: "scan" },
        { id: 2, title: "Local Processing", description: "Expert stone cutting and finishing in-house.", image: "/local-processing.jpg", icon: "layers" },
        { id: 3, title: "Design Consultation", description: "Collaborative sessions to bring vision to life.", image: "/design_consulation.png", icon: "users" },
      ],
    },
  },
  services: {
    hero: {
      eyebrow: "Our Expertise",
      title: "Beyond",
      emphasis: "The Stone",
      text: "We don't just supply natural stone. We craft, customize, and curate it to fit your vision perfectly.",
    },
    fabrication: {
      eyebrow: "The Workshop",
      heading: "Precision Fabrication",
      items: [
        { id: "profiling", title: "Edge Profiling", description: "From classic pencil rounds to complex drop-face coping. We shape the stone to fit your design language, ensuring every edge is smooth, safe, and aesthetically perfect.", features: ["Bullnose & Pencil Edge", "Drop Face Coping", "Mitred Aprons"], image: "/task-a-2026-02-24/svc-profiling.webp" },
        { id: "curved", title: "Curved Cutting", description: "Standard pavers don't fit curved pools. Our specialized waterjet and bridge saw technology allows us to cut precise radii, creating a seamless flow for organic shapes.", features: ["Radius Cutting", "Template Matching", "Zero-tolerance Fit"], image: "/task-a-2026-02-24/svc-curved.webp" },
        { id: "bespoke", title: "Bespoke Custom", description: "Need a hole for a light fixture? A specific drain cutout? Or a custom-engraved piece? We handle all technical modifications in-house to save you time on site.", features: ["Core Drilling", "Skimmer Box Lids", "Custom Grates"], image: "/task-a-2026-02-24/svc-bespoke.webp" },
      ],
    },
  },
  about: {
    hero: {
      eyebrow: "Since 2003",
      title: "The Stone",
      emphasis: "Keeper.",
      text: "We are not just suppliers. We are curators of geology, bridging the gap between the ancient quarry and the modern home.",
      image: "/task-a-2026-02-24/about-hero-quarry.webp",
      scrollLabel: "Scroll the timeline",
    },
    timeline: [
      { year: "The Origin", title: "Global Sourcing", desc: "It started with a trip to Europe's ancient quarries. We realized that true quality can't be ordered from a catalog; it must be touched.", image: "/task-a-2026-02-24/about-origin-sourcing.webp", align: "left" },
      { year: "The Standard", title: "The 10% Rule", desc: "We established our strict selection criteria early on. Consistency in tone, durability in texture. If we wouldn't use it, we don't sell it.", image: "/task-a-2026-02-24/about-standard-qc.webp", align: "right" },
      { year: "The Place", title: "Bayside Roots", desc: "We planted our roots in Melbourne's Bayside. A showroom built not to display products, but to spark conversations.", image: "/task-a-2026-02-24/about-place-showroom.webp", align: "left" },
    ],
    manifesto: { quote: "We reject 90% of what we find. Not out of arrogance, but out of respect for the home you are building.", label: "Our Philosophy" },
    signature: { quote: "We invite you to experience the difference yourself." },
  },
};
