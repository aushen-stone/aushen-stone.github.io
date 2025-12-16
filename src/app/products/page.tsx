// src/app/products/page.tsx
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ProductSidebar } from "@/app/components/ProductSidebar";
import { ArrowUpRight } from "lucide-react";

// --- MOCK DATA: 模拟不同长宽比的图片，制造错落感 ---
const MOCK_PRODUCTS = [
  {
    id: 1,
    slug: "midnight-bond",
    name: "Midnight Bond",
    category: "Bluestone",
    type: "Pavers",
    image:
      "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    price_level: 2,
  },
  {
    id: 2,
    slug: "tundra-grey",
    name: "Tundra Grey",
    category: "Limestone",
    type: "Pool Coping",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-square",
    price_level: 3,
  },
  {
    id: 3,
    slug: "classic-travertine",
    name: "Classic Travertine",
    category: "Travertine",
    type: "Pavers",
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    price_level: 2,
  },
  {
    id: 4,
    slug: "charcoal-granite",
    name: "Charcoal Granite",
    category: "Granite",
    type: "Cobblestones",
    image:
      "https://images.unsplash.com/photo-1517643312431-7e887884e942?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    price_level: 4,
  },
  {
    id: 5,
    slug: "crazy-paving-slate",
    name: "Crazy Paving Slate",
    category: "Slate",
    type: "Crazy Paving",
    image:
      "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[3/5]",
    price_level: 3,
  },
  {
    id: 6,
    slug: "bianco-carrara",
    name: "Bianco Carrara",
    category: "Marble",
    type: "Slabs",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-square",
    price_level: 4,
  },
  {
    id: 7,
    slug: "ash-grey",
    name: "Ash Grey",
    category: "Granite",
    type: "Pavers",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[3/4]",
    price_level: 1,
  },
  {
    id: 8,
    slug: "italian-porphyry",
    name: "Italian Porphyry",
    category: "Porphyry",
    type: "Cobbles",
    image:
      "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?q=80&w=800&auto=format&fit=crop",
    aspect: "aspect-[4/3]",
    price_level: 3,
  },
];

export default function ProductsPage() {
  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <Navbar />

      {/* --- 1. Page Header (Artistic & Textured) --- */}
      <section className="relative pt-44 pb-24 px-6 md:px-12 overflow-hidden bg-[#1a1c18]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#2A2D28_0%,_#151614_100%)]"></div>

        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        ></div>

        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.2em] text-white/90 mb-6 backdrop-blur-md bg-white/5">
              Collection 2025
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-[#F0F2E4] leading-[0.9]">
              The Stone <br /> <span className="italic text-white/40">Archive</span>
            </h1>
          </div>

          <p className="text-white/70 text-sm md:text-base font-light max-w-sm leading-relaxed border-l border-white/30 pl-6">
            Curated from the world's finest quarries. A dialogue between raw nature and refined architecture.
          </p>
        </div>
      </section>

      {/* --- 2. Main Content (Masonry Layout) --- */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-20">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-10 sticky top-24 z-30">
          <button className="w-full flex items-center justify-between bg-[#1a1c18] text-white px-6 py-4 shadow-lg">
            <span className="uppercase tracking-widest text-xs font-medium">Filter Collection</span>
            <span className="text-xs">+</span>
          </button>
        </div>

        <div className="flex gap-16">
          <ProductSidebar />

          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-end mb-12">
              <div className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 cursor-pointer transition-colors group">
                <span>Sort by Newest</span>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-gray-900 transition-colors"></div>
              </div>
            </div>

            {/* Masonry */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {MOCK_PRODUCTS.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group cursor-pointer break-inside-avoid block"
                >
                  {/* Image Container */}
                  <div className={`relative ${product.aspect} overflow-hidden bg-[#E5E5E5]`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <ArrowUpRight size={20} className="text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="pt-5 flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-2xl text-gray-900 leading-none group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">
                        {product.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">
                        {product.category}
                      </p>
                    </div>

                    {/* Price Level Dots (修复：price_level 是 number) */}
                    <div className="flex gap-0.5 mt-1 opacity-40">
                      {Array.from({ length: product.price_level }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-gray-900"></div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Loader */}
            <div className="mt-32 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="font-serif italic text-2xl mb-2">Discover More</span>
              <div className="h-12 w-[1px] bg-gray-900"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
