"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Footer } from "@/app/components/Footer";
import { ArrowUpRight, MoveDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

type ProjectItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  image: string;
  aspect: string;
  gridArea: "left" | "right" | "center";
};

// --- MOCK DATA ---
const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    slug: "brighton-residence",
    title: "Brighton Residence",
    category: "Residential",
    location: "Melbourne, VIC",
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop",
    aspect: "aspect-[16/10]",
    gridArea: "left",
  },
  {
    id: 2,
    slug: "toorak-pool-house",
    title: "Toorak Pool House",
    category: "Landscape",
    location: "Toorak, VIC",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    gridArea: "right",
  },
  {
    id: 3,
    slug: "mornington-peninsula-winery",
    title: "Mornington Peninsula Winery",
    category: "Commercial",
    location: "Mornington, VIC",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    aspect: "aspect-[16/9]",
    gridArea: "left",
  },
  {
    id: 4,
    slug: "hawthorn-courtyard",
    title: "Hawthorn Courtyard",
    category: "Residential",
    location: "Hawthorn, VIC",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    gridArea: "right",
  },
  {
    id: 5,
    slug: "sorrento-coastal-home",
    title: "Sorrento Coastal Home",
    category: "Residential",
    location: "Sorrento, VIC",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    aspect: "aspect-[3/2]",
    gridArea: "center",
  },
];

const CATEGORIES = ["All", "Residential", "Commercial", "Landscape"];

// === ProjectCard ===
function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1,
      }}
      className={`relative w-full group cursor-pointer
        ${project.gridArea === "center" ? "max-w-5xl mx-auto md:mt-20" : "max-w-4xl"}
        ${project.gridArea === "right" ? "ml-auto md:mt-32" : "mr-auto"}
      `}
    >
      {/* Image Container with Parallax */}
      <div className={`relative w-full ${project.aspect} overflow-hidden bg-gray-200`}>
        <motion.div style={{ y, scale }} className="w-full h-full relative">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-filter duration-700 group-hover:brightness-90"
          />
        </motion.div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
            <span className="text-white text-[10px] uppercase tracking-widest">View</span>
          </div>
        </div>
      </div>

      {/* Caption Section */}
      <div className="mt-8 flex justify-between items-end border-t border-gray-900/10 pt-5">
        <div className="overflow-hidden">
          <motion.h3
            className="font-serif text-[clamp(1.6rem,4vw,2.4rem)] text-[#1a1c18] mb-2 leading-tight"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {project.title}
          </motion.h3>
          <motion.p
            className="text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.2em] text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {project.location} — {project.category}
          </motion.p>
        </div>

        <div className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
          <ArrowUpRight
            size={24}
            strokeWidth={1}
            className="text-gray-300 group-hover:text-[#1a1c18] transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      {/* --- Header --- */}
      <section className="relative bg-[#1a1c18] pt-36 sm:pt-40 md:pt-44 pb-24 sm:pb-32 page-padding-x overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-[#2A2D28] to-transparent opacity-30 pointer-events-none" />

        <div className="max-w-[1800px] mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <span className="block text-white/40 text-[10px] uppercase tracking-[0.3em] mb-6 pl-1">
              Selected Works 2020 — 2024
            </span>
            <h1 className="font-serif text-[clamp(2.2rem,8.4vw,7rem)] text-[#F8F5F1] leading-[0.85] tracking-tight">
              Curated <br /> <span className="italic text-white/30 ml-4 md:ml-12">Spaces</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-end gap-8"
          >
            <p className="text-white/60 text-sm font-light max-w-xs text-right leading-relaxed hidden md:block">
              A showcase of natural stone in its finest form. From private residences to public
              landmarks.
            </p>
            <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-widest animate-pulse">
              Explore <MoveDown size={14} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Filter Bar (Sticky) --- */}
      <div className="sticky top-[var(--content-sticky-top)] z-40 bg-[#F8F5F1]/90 backdrop-blur-md border-b border-gray-200/50 transition-all">
        <div className="max-w-[1800px] mx-auto page-padding-x py-4 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 sm:px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.14em] sm:tracking-widest transition-all duration-500 border
                  ${
                    activeCategory === cat
                      ? "bg-[#1a1c18] text-white border-[#1a1c18]"
                      : "bg-transparent text-gray-500 border-transparent hover:border-gray-200 hover:text-gray-900"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 hidden md:block">
            {filteredProjects.length} Projects
          </span>
        </div>
      </div>

      {/* --- The Animated Gallery --- */}
      <div className="max-w-[1800px] mx-auto page-padding-x py-16 sm:py-20 md:py-32">
        <div className="flex flex-col gap-14 sm:gap-20 md:gap-32">
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F5F1]"
              aria-label={`View project: ${project.title}`}
            >
              <ProjectCard project={project} index={index} />
            </Link>
          ))}
        </div>

        <div className="mt-40 text-center opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
          <p className="font-serif italic text-gray-900 text-2xl">End of Selection</p>
          <div className="w-[1px] h-16 bg-gray-900 mx-auto mt-4" />
        </div>
      </div>

      <Footer />
    </main>
  );
}
