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
    projectShowcase: {
      titlePrefix: "Get Inspired by",
      titleEmphasis: "Our Favorite",
      titleSuffix: "Projects",
      text: "Explore our curated portfolio of residential and commercial spaces, showcasing the timeless beauty of natural stone in harmony with modern architecture.",
      image: "/Application001.webp",
      linkLabel: "Explore More",
      linkHref: "/projects",
    },
    accessories: {
      eyebrow: "Accessories",
      heading: "The finishing pieces behind the stone.",
      text: "From sealing and maintenance to flush access covers and edge restraint, these are the supporting systems we pair with stone projects.",
      primaryLabel: "Explore Accessories",
      primaryHref: "/accessories/",
      secondaryLabel: "Talk to Us",
      secondaryHref: "/contact/",
      items: {
        chemforce: { eyebrow: "Stone care", blurb: "Sealers, enhancers, and cleaners for protecting and maintaining finished surfaces.", note: "Protection, enhancement, and remedial cleaning" },
        hide: { eyebrow: "Access covers", blurb: "Flush lids and covers that sit back into paving, tile, and pool surrounds.", note: "Tile-in, paved, and recessed cover systems" },
        formboss: { eyebrow: "Edging systems", blurb: "Steel edging and support details that sharpen the transition into landscape.", note: "Garden edging, planters, and install hardware" },
      },
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
    creativeHub: {
      marquee: "Our Space, Your Creative Hub",
      images: [
        { src: "/Homeowners.webp", alt: "Creative Hub Showroom Area" },
        { src: "/Professionals.webp", alt: "Material Selection Table" },
      ],
      audiences: [
        { title: "Home Owners", lead: "Feeling overwhelmed and stressed of your garden renovation?", text: "Our experienced garden design team is here ready to guide you through the material selection process, ensuring your vision comes to life effortlessly.", label: "Book A Consultation", href: "/contact" },
        { title: "Professionals", lead: "Need an inspiring space with all material samples ready to discuss the project with your clients?", text: "Whether you are a builder, landscaper, or designer, we are committed to offering a space free of charge, with coffee on us.", label: "Book The Space", href: "/contact" },
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
    consultation: { image: "/task-a-2026-02-24/svc-consultation.webp", imageAlt: "Showroom Consultation", quote: "Bring your plans, the coffee is on us.", eyebrow: "Design Consultation", heading: "Not sure where to start?", text: "Navigating natural stone options can be overwhelming. Our experienced team is here to guide you through color palettes, finishes, and technical suitability for your specific project.", label: "Book A Consultation", href: "/contact" },
    logistics: {
      heading: "Seamless Delivery",
      stepLabel: "Step 03 — Final Mile",
      items: [
        { title: "Trusted Installer Network", text: "We don't install, but we know who does it best. Access our curated list of verified professionals.", icon: "network" },
        { title: "Flexible Logistics", text: "Tight access? No problem. We coordinate crane trucks to ensure your stone is delivered safely.", icon: "logistics" },
        { title: "After-Care Support", text: "Detailed advice on sealing, cleaning, and maintaining your stone for decades to come.", icon: "support" },
      ],
    },
    cta: { heading: "Ready to begin?", text: "Let's discuss your project over coffee.", primaryLabel: "Contact Us", primaryHref: "/contact", secondaryLabel: "Visit Showroom", secondaryHref: "/contact" },
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
