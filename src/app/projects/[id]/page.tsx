"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { ArrowDownLeft } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

type ProjectGalleryItem = {
  type: "full" | "half";
  src: string;
  alt: string;
};

type ProjectProduct = {
  name: string;
  category: string;
  image: string;
  slug: string;
};

type ProjectDetailRecord = {
  slug: string;
  title: string;
  location: string;
  year: string;
  tags: string[];
  credits: {
    architect: string;
    builder: string;
    landscaper: string;
    photographer: string;
  };
  description: string;
  gallery: ProjectGalleryItem[];
  products: ProjectProduct[];
};

const SHARED_GALLERY: ProjectGalleryItem[] = [
  {
    type: "full",
    src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    alt: "Wide shot of pool area",
  },
  {
    type: "half",
    src: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop",
    alt: "Detail of coping",
  },
  {
    type: "half",
    src: "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=1200&auto=format&fit=crop",
    alt: "Top down view of pavers",
  },
  {
    type: "full",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    alt: "Exterior facade",
  },
];

const PROJECT_DETAILS: ProjectDetailRecord[] = [
  {
    slug: "brighton-residence",
    title: "Brighton Residence",
    location: "Brighton, Victoria",
    year: "2023",
    tags: ["Residential", "Pool", "Landscape"],
    credits: {
      architect: "Studio A&D",
      builder: "Construct Co.",
      landscaper: "Green Life Designs",
      photographer: "Timothy Kaye",
    },
    description:
      "A monolithic expression of raw materials. The Brighton Residence utilizes our Cathedral Limestone to blur the boundaries between interior living and poolside terrace.",
    gallery: SHARED_GALLERY,
    products: [
      {
        name: "Cathedral Limestone",
        category: "Limestone",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        slug: "cathedral-limestone",
      },
      {
        name: "Midnight Bond Pavers",
        category: "Bluestone",
        image:
          "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=800&auto=format&fit=crop",
        slug: "midnight-bond",
      },
    ],
  },
  {
    slug: "toorak-pool-house",
    title: "Toorak Pool House",
    location: "Toorak, Victoria",
    year: "2022",
    tags: ["Residential", "Pool"],
    credits: {
      architect: "Pierce Atelier",
      builder: "Form Build",
      landscaper: "South Garden Studio",
      photographer: "Lara Finch",
    },
    description:
      "A restrained material palette designed for outdoor living. Warm textured stone creates continuity from the pool edge to the terrace and internal floor plane.",
    gallery: SHARED_GALLERY,
    products: [
      {
        name: "Coastal Limestone",
        category: "Limestone",
        image:
          "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop",
        slug: "coastal-limestone",
      },
      {
        name: "Saltwash Coping",
        category: "Pool Coping",
        image:
          "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
        slug: "saltwash-coping",
      },
    ],
  },
  {
    slug: "mornington-peninsula-winery",
    title: "Mornington Peninsula Winery",
    location: "Mornington, Victoria",
    year: "2021",
    tags: ["Commercial", "Hospitality"],
    credits: {
      architect: "Terrain Projects",
      builder: "Harbor Constructions",
      landscaper: "Native Field",
      photographer: "Michael Ward",
    },
    description:
      "A hospitality project shaped around robust finishes and tonal consistency. The stone palette supports high traffic requirements while retaining premium character.",
    gallery: SHARED_GALLERY,
    products: [
      {
        name: "Vineyard Travertine",
        category: "Travertine",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
        slug: "vineyard-travertine",
      },
      {
        name: "Sawn Bluestone",
        category: "Bluestone",
        image:
          "https://images.unsplash.com/photo-1621260405282-3d76378e906c?q=80&w=800&auto=format&fit=crop",
        slug: "sawn-bluestone",
      },
    ],
  },
  {
    slug: "hawthorn-courtyard",
    title: "Hawthorn Courtyard",
    location: "Hawthorn, Victoria",
    year: "2020",
    tags: ["Residential", "Landscape"],
    credits: {
      architect: "Urban Habitat Studio",
      builder: "Wattle Build",
      landscaper: "Courtyard Works",
      photographer: "June Park",
    },
    description:
      "A compact courtyard transformed through dimensional paving and soft-toned walling. The material strategy balances texture, drainage and tactile comfort.",
    gallery: SHARED_GALLERY,
    products: [
      {
        name: "Ash Blend Sandstone",
        category: "Sandstone",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        slug: "ash-blend-sandstone",
      },
      {
        name: "Linear Steppers",
        category: "Pavers",
        image:
          "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=800&auto=format&fit=crop",
        slug: "linear-steppers",
      },
    ],
  },
  {
    slug: "sorrento-coastal-home",
    title: "Sorrento Coastal Home",
    location: "Sorrento, Victoria",
    year: "2024",
    tags: ["Residential", "Coastal"],
    credits: {
      architect: "North Bay Studio",
      builder: "Coastline Projects",
      landscaper: "Salt + Soil",
      photographer: "Ari Holt",
    },
    description:
      "A coastal residence that prioritizes durability in salt-air conditions. Finishes were selected for anti-slip performance and low-maintenance ageing.",
    gallery: SHARED_GALLERY,
    products: [
      {
        name: "Marine Grade Limestone",
        category: "Limestone",
        image:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
        slug: "marine-grade-limestone",
      },
      {
        name: "Ribbed Coping",
        category: "Pool Coping",
        image:
          "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
        slug: "ribbed-coping",
      },
    ],
  },
];

function ProjectHero({ project }: { project: ProjectDetailRecord }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden bg-[#1a1c18]">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <img
          src={project.gallery[0].src}
          alt={`${project.title} hero`}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c18]/90 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-10"
      >
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="block text-white/60 text-[10px] uppercase tracking-[0.3em] mb-4">
                {project.location} — {project.year}
              </span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-[#F8F5F1] leading-[0.9]">
                {project.title}
              </h1>
            </div>
            <div className="hidden md:block">
              <ArrowDownLeft size={48} strokeWidth={0.5} className="text-white/50 animate-bounce" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function GetTheLook({ project }: { project: ProjectDetailRecord }) {
  return (
    <section className="bg-[#1a1c18] text-[#F8F5F1] py-24 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[#F0F2E4]/60 text-[10px] uppercase tracking-[0.3em] mb-4 block">
              Material Palette
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
              Get The Look
            </h2>
            <p className="mt-4 text-white/50 font-light text-sm max-w-md">
              Authentic natural stones used in this project, available for your next design.
            </p>
          </div>
          <Link
            href="/products"
            className="border border-white/20 text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#1a1c18] transition-all"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {project.products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-white/5 overflow-hidden mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-black px-4 py-2 text-[10px] uppercase tracking-widest">
                    View Stone
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-1 group-hover:underline decoration-white/30 underline-offset-4">
                {product.name}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{product.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const slug = Array.isArray(idParam) ? idParam[0] : idParam;

  const project = useMemo(
    () => PROJECT_DETAILS.find((item) => item.slug === slug),
    [slug]
  );

  const nextProject = useMemo(() => {
    if (!project) return null;
    const currentIndex = PROJECT_DETAILS.findIndex((item) => item.slug === project.slug);
    if (currentIndex < 0) return null;
    return PROJECT_DETAILS[(currentIndex + 1) % PROJECT_DETAILS.length];
  }, [project]);

  if (!project) {
    return (
      <main className="bg-[#F8F5F1] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-40">
          <h1 className="font-serif text-4xl text-gray-900 mb-4">Project not found</h1>
          <p className="text-gray-600 mb-8">
            The project you&apos;re trying to view doesn&apos;t exist in this collection.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 uppercase tracking-[0.18em] text-xs border border-gray-300 px-5 py-3 hover:border-gray-900 transition-colors"
          >
            Back to projects
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#1a1c18] selection:text-white">
      <ProjectHero project={project} />

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[#1a1c18]">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-t border-gray-200 pt-8">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    Architect
                  </span>
                  <span className="block text-sm font-medium text-gray-900">
                    {project.credits.architect}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    Builder
                  </span>
                  <span className="block text-sm font-medium text-gray-900">
                    {project.credits.builder}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    Landscape
                  </span>
                  <span className="block text-sm font-medium text-gray-900">
                    {project.credits.landscaper}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    Photography
                  </span>
                  <span className="block text-sm font-medium text-gray-900">
                    {project.credits.photographer}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-gray-300 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-16 md:gap-32">
            {project.gallery.map((img, index) => {
              if (img.type === "full") {
                return (
                  <motion.div
                    key={`${img.alt}-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1 }}
                    className="w-full aspect-[16/9] overflow-hidden bg-gray-200"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                    />
                    <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 text-right">
                      {img.alt}
                    </p>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={`${img.alt}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1 }}
                  className="w-full md:w-[80%] aspect-[4/5] overflow-hidden bg-gray-200 ml-auto"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                  />
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">{img.alt}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <GetTheLook project={project} />

      {nextProject && (
        <div className="bg-[#F8F5F1] py-20 text-center border-t border-gray-200">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Next Project</p>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="font-serif text-4xl md:text-6xl text-[#1a1c18] hover:italic transition-all"
          >
            {nextProject.title}
          </Link>
        </div>
      )}

      <Footer />
    </main>
  );
}
