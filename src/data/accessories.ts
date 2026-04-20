import type { AccessoryBrand, AccessoryBrandSlug } from "@/types/accessory";

export const ACCESSORY_BRANDS: readonly AccessoryBrand[] = [
  {
    slug: "chemforce",
    name: "Chemforce",
    navLabel: "Chemforce",
    route: "/accessories/chemforce/",
    seoTitle: "Chemforce Stone Sealers & Cleaners | Aushen Stone",
    seoDescription:
      "Browse Chemforce sealers, enhancers, and stone-care cleaners curated by Aushen Stone for natural stone, pavers, and tiled outdoor areas.",
    summary:
      "Stone-care chemistry for sealing, enhancing, cleaning, and remedial maintenance across natural stone, pavers, and tiled outdoor areas.",
    coverImage: {
      src: "https://panel.aushenstone.com.au/wp-content/uploads/2017/06/Stain-Protector_Gang-Shot_21June2022-1024x772-1.jpeg",
      alt: "Chemforce sealers grouped together on a stone-care product display.",
      focalPoint: "center",
      caption:
        "Chemforce brings together the sealing, enhancing, and cleaning products most often asked for on stone projects.",
    },
    hero: {
      eyebrow: "Accessories / Stone Care",
      headline: "Chemforce keeps the finish looking intentional long after install day.",
      body:
        "Chemforce helps protect the look of the finished surface, whether the job needs a penetrating sealer, a colour enhancer, or a more targeted cleaner for maintenance and remedial work.",
      image: {
        src: "https://panel.aushenstone.com.au/wp-content/uploads/2017/06/Stain-Protector_Gang-Shot_21June2022-1024x772-1.jpeg",
        alt: "Chemforce product lineup photographed together for stone sealing and maintenance.",
        focalPoint: "center",
      },
      ambientNote:
        "This range is focused on the stone-care products most relevant to paving, pool surrounds, and finished hardscape maintenance.",
      primaryCta: {
        label: "Enquire About Chemforce",
        href: "/contact/",
      },
      secondaryCta: {
        label: "Call for Product Advice",
        href: "tel:+61430799906",
      },
    },
    stats: [
      {
        value: "6",
        label: "Core products",
        supportingText:
          "The range stays focused on the sealers, enhancers, and cleaners most useful on stone projects.",
      },
      {
        value: "1L-20L",
        label: "Common pack sizes",
        supportingText:
          "Pack sizes vary by product, with small top-up packs and trade-oriented containers both available.",
      },
      {
        value: "AU",
        label: "Australian made",
        supportingText:
          "Current Chemforce category pages position the brand as Australian owned and made.",
      },
    ],
    overview: {
      heading: "A tighter range, chosen for stone projects",
      body:
        "Chemforce is a larger construction-chemistry brand, but the Aushen fit is the stone and tile care slice: protection before handover, cleaning during maintenance, and remedial products when natural stone picks up stains, grout haze, or installation residue.",
      bullets: [
        "Use sealers and enhancers when the look of the finished stone matters as much as protection.",
        "Keep cleaners separate from protection products so maintenance does not undo the original finish.",
        "Treat the page as a curated selection rather than the full Chemforce industrial catalog.",
      ],
    },
    projectApplications: [
      "Natural stone sealing before project handover",
      "Routine cleaning of outdoor paving and pool surrounds",
      "Stain and residue treatment after install or heavy use",
      "Colour enrichment when a stone needs more depth without a topical film",
    ],
    families: [
      {
        slug: "sealers-and-enhancers",
        name: "Sealers & enhancers",
        summary:
          "Protection-led products for reducing staining, consolidating the surface, or enriching colour where the brief calls for a deeper finish.",
        detail:
          "This family covers the core protective layer of the Chemforce offer: penetrating protection, surface strengthening, and colour enrichment for natural stone and pavers.",
        highlights: [
          "Includes Stain Protector, Fortifier Plus, and Enhance+.",
          "Most relevant when the client wants durability without a thick topical coating.",
          "Best matched to the stone and finish after installation details are confirmed.",
        ],
        image: {
          src: "https://chemforce.com.au/wp-content/uploads/2023/07/Enhance.png",
          alt: "Chemforce Enhance+ sealer packshot.",
          focalPoint: "center",
        },
      },
      {
        slug: "cleaners-and-restorers",
        name: "Cleaners & restorers",
        summary:
          "Remedial cleaners for efflorescence, organic staining, and post-install residue where standard wash-down is not enough.",
        detail:
          "This range is about problem-solving rather than day-one protection. It supports maintenance, cleanup, and recovery after the project has already been laid, grouted, or exposed to heavy use.",
        highlights: [
          "Includes TED and Oxitec-M.",
          "Useful when the surface needs targeted cleaning rather than a general-purpose detergent.",
          "Selection should follow the stain type and the stone's tolerance for stronger chemistry.",
        ],
        image: {
          src: "https://chemforce.com.au/wp-content/uploads/2023/07/Oxitec-M-mockup-5L-1.jpg",
          alt: "Chemforce Oxitec-M cleaner bottle and canister packshot.",
          focalPoint: "center",
        },
      },
      {
        slug: "specialty-removal",
        name: "Specialty removal",
        summary:
          "A narrow, specialist part of the range for harder cleanup jobs that sit outside routine sealing or maintenance.",
        detail:
          "GR2 is best treated as a problem-solver for residue and difficult cleanup rather than as an everyday maintenance product.",
        highlights: [
          "This specialty line stays intentionally tight and targeted.",
          "Useful for projects that need remedial cleanup after adhesives, coatings, or stubborn marking.",
          "Positioned as advisory stock rather than a broad DIY shelf.",
        ],
        image: {
          src: "https://chemforce.com.au/wp-content/uploads/2023/07/GR-2-etched.png",
          alt: "Chemforce GR2 specialty remover packshot.",
          focalPoint: "center",
        },
      },
    ],
    coreItems: [
      {
        name: "Stain Protector",
        summary:
          "Impregnating sealer for protecting natural stone, pavers, polished concrete, floors, and tiles from common staining.",
        packSizes: ["1L", "5L", "20L"],
        sourceUrl: "https://chemforce.com.au/products/stain-protector/",
      },
      {
        name: "Fortifier Plus",
        summary:
          "Protective treatment used where added surface strengthening is part of the maintenance or handover brief.",
        packSizes: ["5L", "20L"],
        sourceUrl: "https://chemforce.com.au/products/fortifier-plus/",
      },
      {
        name: "Enhance+",
        summary:
          "Impregnating enhancer for bringing more depth and richness into stone while still protecting the surface.",
        packSizes: ["1L", "5L"],
        sourceUrl: "https://chemforce.com.au/products/enhance/",
      },
      {
        name: "TED",
        summary:
          "Targeted cleaner for stone and tile maintenance where routine wash-down is not enough.",
        packSizes: ["1L", "5L", "20L"],
        sourceUrl: "https://chemforce.com.au/products/ted/",
      },
      {
        name: "Oxitec-M",
        summary:
          "Oxygen cleaner suited to natural stone, masonry, tile, concrete, and grout remediation.",
        packSizes: ["5L", "20L"],
        sourceUrl: "https://chemforce.com.au/products/oxitec-m/",
      },
      {
        name: "GR2",
        summary:
          "Specialty remover for difficult cleanup scenarios where standard maintenance products are not enough.",
        packSizes: ["5L"],
        sourceUrl: "https://chemforce.com.au/products/gr2/",
      },
    ],
    resources: [
      {
        label: "Official Tile & Stone Protection Range",
        href: "https://chemforce.com.au/product-category/tile-stone-protection/",
        kind: "category",
      },
      {
        label: "Fortifier Plus Product Page",
        href: "https://chemforce.com.au/products/fortifier-plus/",
        kind: "official",
      },
      {
        label: "Stain Protector Product Page",
        href: "https://chemforce.com.au/products/stain-protector/",
        kind: "official",
      },
      {
        label: "Enhance+ Product Page",
        href: "https://chemforce.com.au/products/enhance/",
        kind: "official",
      },
      {
        label: "Oxitec-M Product Page",
        href: "https://chemforce.com.au/products/oxitec-m/",
        kind: "official",
      },
    ],
    cta: {
      heading: "Need help choosing the right sealer or cleaner?",
      body:
        "Tell us what stone you are using, what finish it has, and whether you are protecting, cleaning, or troubleshooting. We can narrow the Chemforce range to the products that actually suit the job.",
      primary: {
        label: "Talk to Aushen",
        href: "/contact/",
      },
      secondary: {
        label: "Call 0430 799 906",
        href: "tel:+61430799906",
      },
    },
    palette: {
      surface: "#F4F0E8",
      ink: "#1D221A",
      accent: "#6D7B4D",
      accentSoft: "rgba(109, 123, 77, 0.14)",
      border: "rgba(29, 34, 26, 0.14)",
    },
  },
  {
    slug: "hide",
    name: "HIDE",
    navLabel: "HIDE",
    route: "/accessories/hide/",
    seoTitle: "HIDE Skimmer Lids & Access Covers | Aushen Stone",
    seoDescription:
      "Discover HIDE skimmer lids, access covers, drain covers, and polymer or stainless systems curated by Aushen Stone for pool and landscape projects.",
    summary:
      "Flush inlay lids and covers for pool and landscape projects where service access needs to disappear into the finished surface instead of interrupting it.",
    coverImage: {
      src: "https://info.skimmerlids.com.au/hubfs/Access-Cover-1-1.jpg",
      alt: "HIDE access cover integrated neatly into a landscaped outdoor surface.",
      focalPoint: "center",
      caption:
        "HIDE is about keeping access practical without letting it dominate the finished space.",
    },
    hero: {
      eyebrow: "Accessories / Pool & Landscape Access",
      headline: "HIDE turns utility access into part of the finish, not a visual interruption.",
      body:
        "For pool surrounds, drainage zones, and hardscape detailing, HIDE gives us a cleaner way to integrate skimmer lids, access covers, and drain systems into stone and tile layouts.",
      image: {
        src: "https://info.skimmerlids.com.au/hubfs/Skimmer-Lid-1-1.jpg",
        alt: "HIDE skimmer lid integrated into a paved outdoor setting.",
        focalPoint: "center",
      },
      ambientNote:
        "HIDE works best when the range is read as a full system: skimmer lids, access covers, drain covers, and polymer or hybrid options matched to the finished surface.",
      primaryCta: {
        label: "Enquire About HIDE",
        href: "/contact/",
      },
      secondaryCta: {
        label: "Call for Cover Selection",
        href: "tel:+61430799906",
      },
    },
    stats: [
      {
        value: "306-412mm",
        label: "Skimmer sizes",
        supportingText:
          "Current HIDE skimmer-lid coverage extends beyond the narrower sizes shown on older Aushen pages.",
      },
      {
        value: "20-60mm",
        label: "Common depths",
        supportingText:
          "Depth selection is one of the main choice points because it must align with the stone, tile, or concrete infill.",
      },
      {
        value: "316",
        label: "Marine-grade stainless",
        supportingText:
          "Stainless and stainless-plus-polymer options stay relevant for premium pool and landscape work.",
      },
    ],
    overview: {
      heading: "Choose by opening first, finish system second",
      body:
        "The HIDE range works best when explained as a system. First match the opening or service requirement, then decide how the cover should receive the finished surface: stainless, polymer, concrete, or a hybrid kit.",
      bullets: [
        "Use skimmer lids and access covers where the hardscape should read as one continuous surface.",
        "Keep drain and linear systems nearby in the same brand page because they are often specified together.",
        "Lead with fit, depth, and finish compatibility rather than talking about HIDE as a decorative product.",
      ],
    },
    projectApplications: [
      "Pool skimmer lids integrated with coping and surrounding paving",
      "Access covers set into tiled or stone-clad landscaped areas",
      "Drain covers and linear drains around pools and hardscape edges",
      "Projects where flush utility detailing matters as much as the paving material itself",
    ],
    families: [
      {
        slug: "skimmer-lids",
        name: "Skimmer lids",
        summary:
          "The core HIDE family for pool surrounds, where the skimmer access point needs to align with the finished paving instead of standing out as a plastic service lid.",
        detail:
          "Current HIDE coverage includes multiple lid sizes and depth options so the lid can accept stone, tile, or concrete infill while staying practical to remove and service.",
        highlights: [
          "Current HIDE pages list 306mm, 342mm, and 412mm skimmer lids.",
          "Depth options commonly run from 10mm up to 60mm depending on system.",
          "Available across stainless, polymer, and concrete-compatible ranges.",
        ],
        image: {
          src: "https://skimmerlids.com.au/wp-content/uploads/2018/06/HIDE-Skimmer-Lid-Opening-1-1024x1024.jpg",
          alt: "HIDE skimmer lid shown open in a paved landscape setting.",
          focalPoint: "center",
        },
      },
      {
        slug: "access-and-drain-covers",
        name: "Access & drain covers",
        summary:
          "Service access and drainage systems that keep the detailing calm across gardens, pool zones, and paved circulation areas.",
        detail:
          "HIDE treats access covers, drain covers, and larger drainage lids as related solutions. The product logic stays the same: choose the opening size, choose the inlay depth, then match the surrounding material.",
        highlights: [
          "Current access-cover sizes span compact utility points through to larger landscape access formats.",
          "Drain-cover options include standard square formats and larger cover systems.",
          "Useful for coordinated detailing when skimmer lids, drain points, and other services appear in the same project.",
        ],
        image: {
          src: "https://info.skimmerlids.com.au/hubfs/Drain-Cover-1.jpg",
          alt: "HIDE drain cover integrated into an outdoor surface.",
          focalPoint: "center",
        },
      },
      {
        slug: "polymer-and-linear",
        name: "Polymer, combination & linear systems",
        summary:
          "The more technical side of HIDE, where bonding, earthing, finish thickness, or linear drainage layout drives the right system choice.",
        detail:
          "Polymer covers, stainless-plus-polymer combination kits, and linear drain covers let the range flex for different project constraints, especially around pools and tiled hardscape.",
        highlights: [
          "Full polymer kits are available in selected sizes and colourways.",
          "Combination kits pair stainless lids with polymer edge protection.",
          "Linear drain covers keep the HIDE language consistent when square lids are not the only access challenge on site.",
        ],
        image: {
          src: "https://info.skimmerlids.com.au/hubfs/Tile-Linear-Drain-Cover---Corner-copy.jpg",
          alt: "HIDE linear drain cover aligned with tiled paving.",
          focalPoint: "center",
        },
      },
    ],
    coreItems: [
      {
        name: "Skimmer Lid Kits",
        summary:
          "Flush inlay skimmer lids sized for pool service access while allowing the finished surface to continue over the lid.",
        sizes: ["306mm", "342mm", "412mm"],
        depths: ["10mm", "20mm", "30mm", "40mm", "50mm", "60mm"],
        sourceUrl: "https://skimmerlids.com.au/hide-range/skimmer-lid-kit/",
      },
      {
        name: "Access Covers",
        summary:
          "Access covers for service points through landscape and paved areas, with both square and rectangular formats in the wider HIDE range.",
        sizes: [
          "156mm",
          "206mm",
          "256mm",
          "306mm",
          "342mm",
          "412mm",
          "506mm",
          "656mm",
        ],
        depths: ["10mm", "20mm", "30mm", "40mm", "50mm", "60mm"],
        sourceUrl: "https://skimmerlids.com.au/hide-range/access-cover/",
      },
      {
        name: "Full Polymer Kits",
        summary:
          "Polymer skimmer lids and access covers used where a bond-free or all-polymer approach is preferred.",
        sizes: ["306mm skimmer lid", "342mm skimmer lid", "206mm access cover"],
        depths: ["20mm", "30mm"],
        colors: ["Ash", "Bone", "Charcoal"],
        sourceUrl: "https://skimmerlids.com.au/hide-range/hide-full-polymer-kits/",
      },
      {
        name: "Combination Kits",
        summary:
          "Hybrid systems pairing a 316 stainless lid with polymer edge protection for a more technical project requirement.",
        sizes: ["206mm", "306mm", "342mm"],
        depths: ["20mm", "30mm", "40mm concrete infill"],
        note: "Current Australian HIDE materials reference a 40mm concrete infill option in Ash.",
        sourceUrl: "https://skimmerlids.com.au/hide-range/hide-stainless-steel-polymer/",
      },
      {
        name: "Drain & Linear Covers",
        summary:
          "Drain-cover families that keep pool, paving, and landscape detailing consistent when square lids are not enough.",
        sizes: [
          "314mm drain cover",
          "342mm drain cover",
          "656mm drain cover",
          "linear formats",
        ],
        sourceUrl: "https://info.skimmerlids.com.au/hide-product-range",
      },
    ],
    resources: [
      {
        label: "Official HIDE Product Range",
        href: "https://info.skimmerlids.com.au/hide-product-range",
        kind: "guide",
      },
      {
        label: "Skimmer Lid Kit Range",
        href: "https://skimmerlids.com.au/hide-range/skimmer-lid-kit/",
        kind: "official",
      },
      {
        label: "Access Cover Range",
        href: "https://skimmerlids.com.au/hide-range/access-cover/",
        kind: "official",
      },
      {
        label: "Full Polymer Kit Range",
        href: "https://skimmerlids.com.au/hide-range/hide-full-polymer-kits/",
        kind: "official",
      },
      {
        label: "Stainless / Polymer Combination Kits",
        href: "https://skimmerlids.com.au/hide-range/hide-stainless-steel-polymer/",
        kind: "official",
      },
    ],
    cta: {
      heading: "Need the right HIDE system for a pool or landscape detail?",
      body:
        "Share the opening size, the stone or tile thickness, and whether the project needs stainless, polymer, or a hybrid solution. We can help narrow the HIDE range before install starts.",
      primary: {
        label: "Talk to Aushen",
        href: "/contact/",
      },
      secondary: {
        label: "Call 0430 799 906",
        href: "tel:+61430799906",
      },
    },
    palette: {
      surface: "#F2F4F0",
      ink: "#151915",
      accent: "#2E6C70",
      accentSoft: "rgba(46, 108, 112, 0.14)",
      border: "rgba(21, 25, 21, 0.12)",
    },
  },
  {
    slug: "formboss",
    name: "FormBoss",
    navLabel: "FormBoss",
    route: "/accessories/formboss/",
    seoTitle: "FormBoss Garden Edging & Planter Systems | Aushen Stone",
    seoDescription:
      "Explore FormBoss steel garden edging, planters, stakes, and corner systems curated by Aushen Stone for paving and landscape projects.",
    summary:
      "Steel edging and planter systems that help define paving, garden beds, level changes, and landscape structure around stone projects.",
    coverImage: {
      src: "https://www.formboss.com.au/wp-content/uploads/2024/02/herobanner-metal-gardening-edging.jpg",
      alt: "FormBoss steel garden edging used to shape a landscaped outdoor space.",
      focalPoint: "center",
      caption:
        "FormBoss belongs beside paving and planting plans, not as an afterthought once the edging has already been decided.",
    },
    hero: {
      eyebrow: "Accessories / Garden Edging",
      headline: "FormBoss gives stone projects the edge detail they deserve.",
      body:
        "When a landscape needs clean boundaries, tree rings, raised beds, or planter forms, FormBoss turns edging from a leftover detail into part of the design language.",
      image: {
        src: "https://www.formboss.com.au/wp-content/uploads/2024/02/herobanner-metal-gardening-edging.jpg",
        alt: "FormBoss hero image showing steel garden edging in a landscaped setting.",
        focalPoint: "center",
      },
      ambientNote:
        "FormBoss is presented at brand level so the main edging, ring, planter, and hardware families can be understood together before the final specification is narrowed.",
      primaryCta: {
        label: "Enquire About FormBoss",
        href: "/contact/",
      },
      secondaryCta: {
        label: "Call for Edging Advice",
        href: "tel:+61430799906",
      },
    },
    stats: [
      {
        value: "75-850mm",
        label: "Profile heights",
        supportingText:
          "Current guides span the light edging end through to larger retaining and ring applications.",
      },
      {
        value: "2.44m",
        label: "Standard length",
        supportingText:
          "The main edging system is built around 2440mm lengths, which helps when planning quantities and site layout.",
      },
      {
        value: "3",
        label: "Core finishes",
        supportingText:
          "Galvanized, REDCOR weathering steel, and ZAM stay central to how the range is merchandised.",
      },
    ],
    overview: {
      heading: "A landscape system, not just a strip of steel",
      body:
        "FormBoss works best as a coordinated landscape system. Edging, rings, raised beds, stakes, corners, and planter systems all belong to one language for shaping the spaces around paving and planting.",
      bullets: [
        "Use FormBoss when paving needs a crisp edge, grade change, or planting transition.",
        "Keep round edging and planter systems visible because they often solve the same client brief as custom masonry edging.",
        "Lead with use case first, then bring in finish and height once the landscape intent is clear.",
      ],
    },
    projectApplications: [
      "Defining lawn, gravel, and planting edges against paving",
      "Creating tree rings, circular beds, and curved landscape lines",
      "Building raised beds and steel planter forms to sit beside stone paving",
      "Handling corners, stakes, and grade transitions in a coordinated edging system",
    ],
    families: [
      {
        slug: "steel-edging",
        name: "Steel garden edging",
        summary:
          "The core FormBoss system for crisp borders, pathways, beds, and transitions where the edge detail matters as much as the paving itself.",
        detail:
          "This is the mainline product family: steel edging lengths with multiple heights and finish options, suited to both straight and gently shaped landscape layouts.",
        highlights: [
          "Standard edging lengths are commonly 2440mm.",
          "Current guides show heights from 75mm upward, extending into more structural applications.",
          "Available across galvanized, REDCOR, and ZAM finishes.",
        ],
        image: {
          src: "https://www.formboss.com.au/wp-content/uploads/2023/12/Ryan-Young-Designs-2-700-x-400.webp",
          alt: "FormBoss steel edging used in a premium landscaped outdoor space.",
          focalPoint: "center",
        },
      },
      {
        slug: "round-and-planter",
        name: "Round edging & planter systems",
        summary:
          "Circular edging, tree rings, raised beds, and planters for projects that need more than a straight boundary line.",
        detail:
          "Round edging and planter products make FormBoss useful beyond simple bed separation. They provide cleaner geometry for trees, feature planting, and raised landscape elements alongside paving.",
        highlights: [
          "Round edging supports multiple standard ring diameters and custom work.",
          "Three Tiered Planters and FormBox extend the range into more architectural planting details.",
          "A practical alternative where masonry planter construction would be overbuilt or too slow.",
        ],
        image: {
          src: "https://www.formboss.com.au/wp-content/uploads/2023/12/corten-garden-rings-for-planter.jpg",
          alt: "FormBoss round edging used around feature planting.",
          focalPoint: "center",
        },
      },
      {
        slug: "stakes-and-corners",
        name: "Stakes, corners & brackets",
        summary:
          "The hardware side of FormBoss that makes the edging system work properly on real sites with corners, levels, and retaining pressure.",
        detail:
          "Connectors, stakes, and corner pieces are not optional extras on complex landscapes; they are part of the system logic that lets edging stay straight, curved, stepped, or retained over time.",
        highlights: [
          "Current FormBoss materials distinguish flat tapered stakes and retaining stakes.",
          "Corner pieces and angled brackets help tidy up geometry without site improvisation.",
          "Useful for keeping the edging range credible to trade customers, not just homeowners.",
        ],
        image: {
          src: "https://www.formboss.com.au/wp-content/uploads/2023/12/Standard-edge-stake-spacing.jpg",
          alt: "FormBoss edging installation showing stake spacing.",
          focalPoint: "center",
        },
      },
    ],
    coreItems: [
      {
        name: "Steel Garden Edging",
        summary:
          "The main edging profile for lawns, beds, pathways, borders, and retaining-style transitions.",
        sizes: [
          "75mm",
          "100mm",
          "150mm",
          "185mm",
          "230mm",
          "290mm",
          "390mm",
          "580mm",
          "850mm",
        ],
        finishes: ["Galvanized", "REDCOR", "ZAM"],
        note: "Standard length is typically 2440mm.",
        sourceUrl: "https://www.formboss.com.au/garden-edging-systems/",
      },
      {
        name: "Round Garden Edging",
        summary:
          "Pre-made rings and curved edging for trees, circular planters, and rounded landscape layouts.",
        sizes: ["590mm", "777mm", "1165mm", "1554mm"],
        finishes: ["Galvanized", "REDCOR", "ZAM"],
        note: "Current guides also note custom ring options.",
        sourceUrl: "https://www.formboss.com.au/round-garden-edging/",
      },
      {
        name: "FormBox Planter Boxes",
        summary:
          "Steel planter-box systems for more architectural raised-bed and courtyard planting work.",
        sizes: ["610mm", "1220mm", "1830mm", "2440mm"],
        depths: ["340mm", "530mm", "740mm"],
        sourceUrl: "https://www.formboss.com.au/formbox/",
      },
      {
        name: "Three Tiered Planters",
        summary:
          "Tiered planter systems that extend FormBoss into more sculptural or feature-planting territory.",
        sizes: ["390mm", "580mm"],
        finishes: ["REDCOR"],
        sourceUrl: "https://www.formboss.com.au/three-tiered-planters/",
      },
      {
        name: "Connectors & Stakes",
        summary:
          "Support hardware for shaping, anchoring, and retaining edging on real sites.",
        sizes: ["240mm", "300mm", "400mm", "600mm", "800mm", "1200mm"],
        sourceUrl: "https://www.formboss.com.au/connectors-stakes/",
      },
    ],
    resources: [
      {
        label: "FormBoss Product List",
        href: "https://www.formboss.com.au/product-list/",
        kind: "guide",
      },
      {
        label: "FormBoss Product Information Guide",
        href: "https://www.formboss.com.au/wp-content/uploads/2024/09/FormBoss-Product-Information-Guide-2024-Single-A4P.pdf",
        kind: "guide",
      },
      {
        label: "Steel Garden Edging",
        href: "https://www.formboss.com.au/garden-edging-systems/",
        kind: "official",
      },
      {
        label: "FormBox Planter Systems",
        href: "https://www.formboss.com.au/formbox/",
        kind: "official",
      },
      {
        label: "Connectors & Stakes",
        href: "https://www.formboss.com.au/connectors-stakes/",
        kind: "official",
      },
    ],
    cta: {
      heading: "Need edging and planter details that work with the paving plan?",
      body:
        "If you already know the paving, planting layout, or level changes, we can help narrow FormBoss down by height, finish, and system family before the landscape package is locked.",
      primary: {
        label: "Talk to Aushen",
        href: "/contact/",
      },
      secondary: {
        label: "Call 0430 799 906",
        href: "tel:+61430799906",
      },
    },
    palette: {
      surface: "#F6F1EA",
      ink: "#1D1815",
      accent: "#8A5A3A",
      accentSoft: "rgba(138, 90, 58, 0.14)",
      border: "rgba(29, 24, 21, 0.12)",
    },
  },
] satisfies readonly AccessoryBrand[];

export const ACCESSORY_BRAND_BY_SLUG: Readonly<
  Record<AccessoryBrandSlug, AccessoryBrand>
> = ACCESSORY_BRANDS.reduce(
  (accumulator, brand) => {
    accumulator[brand.slug] = brand;
    return accumulator;
  },
  {} as Record<AccessoryBrandSlug, AccessoryBrand>
);

export const ACCESSORY_NAV_ITEMS = ACCESSORY_BRANDS.map((brand) => ({
  slug: brand.slug,
  label: brand.navLabel,
  href: brand.route,
  summary: brand.summary,
}));

export function getAccessoryBrandBySlug(slug: string): AccessoryBrand | null {
  return ACCESSORY_BRANDS.find((brand) => brand.slug === slug) ?? null;
}
