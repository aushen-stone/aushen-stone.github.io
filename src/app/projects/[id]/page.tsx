"use client";

import { useRef } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ArrowRight, ArrowDownLeft } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- MOCK DATA: 模拟一个具体的豪宅项目详情 ---
const PROJECT_DETAIL = {
  id: 1,
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
  description: "A monolithic expression of raw materials. The Brighton Residence utilizes our Cathedral Limestone to blur the boundaries between the interior living spaces and the poolside terrace. The brief was to create a sanctuary that feels ancient yet distinctly modern.",
  
  // 叙事图片流
  gallery: [
    { type: "full", src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop", alt: "Wide shot of pool area" },
    { type: "half", src: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop", alt: "Detail of coping" },
    { type: "half", src: "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=1200&auto=format&fit=crop", alt: "Top down view of pavers" },
    { type: "full", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop", alt: "Exterior facade" },
  ],

  // 关联产品 (用于 Get The Look)
  products: [
    {
      name: "Cathedral Limestone",
      category: "Limestone",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      slug: "cathedral-limestone"
    },
    {
      name: "Midnight Bond Pavers",
      category: "Bluestone",
      image: "https://images.unsplash.com/photo-1620626012053-93f2685048d6?q=80&w=800&auto=format&fit=crop",
      slug: "midnight-bond"
    }
  ]
};

// === Component: Hero Section ===
function ProjectHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]); // 图片视差
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]); // 文字淡出

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden bg-[#1a1c18]">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
         <img 
           src={PROJECT_DETAIL.gallery[0].src} 
           alt="Hero" 
           className="w-full h-full object-cover opacity-80"
         />
         {/* 渐变遮罩，保证文字清晰 */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c18]/90 via-transparent to-transparent"></div>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-10"
      >
         <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div>
                  <span className="block text-white/60 text-[10px] uppercase tracking-[0.3em] mb-4">
                    {PROJECT_DETAIL.location} — {PROJECT_DETAIL.year}
                  </span>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-[#F8F5F1] leading-[0.9]">
                    {PROJECT_DETAIL.title}
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

// === Component: Get The Look (Conversion) ===
function GetTheLook() {
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
             <button className="border border-white/20 text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#1a1c18] transition-all">
                View All Products
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {PROJECT_DETAIL.products.map((product) => (
                <a key={product.slug} href={`/products/${product.slug}`} className="group block cursor-pointer">
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
                   <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {product.category}
                   </p>
                </a>
             ))}
          </div>
       </div>
    </section>
  );
}

export default function ProjectDetail() {
  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#1a1c18] selection:text-white">
      <Navbar />
      
      {/* 1. Hero */}
      <ProjectHero />

      {/* 2. Credits & Narrative */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Sidebar: Credits (Sticky) */}
            <div className="lg:col-span-4">
               <div className="sticky top-32 space-y-12">
                  
                  {/* Introduction */}
                  <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[#1a1c18]">
                     {PROJECT_DETAIL.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-t border-gray-200 pt-8">
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Architect</span>
                        <span className="block text-sm font-medium text-gray-900">{PROJECT_DETAIL.credits.architect}</span>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Builder</span>
                        <span className="block text-sm font-medium text-gray-900">{PROJECT_DETAIL.credits.builder}</span>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Landscape</span>
                        <span className="block text-sm font-medium text-gray-900">{PROJECT_DETAIL.credits.landscaper}</span>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Photography</span>
                        <span className="block text-sm font-medium text-gray-900">{PROJECT_DETAIL.credits.photographer}</span>
                     </div>
                  </div>

               </div>
            </div>

            {/* Main Content: Gallery Stream */}
            <div className="lg:col-span-8 flex flex-col gap-16 md:gap-32">
               {PROJECT_DETAIL.gallery.map((img, index) => {
                 // 动态布局逻辑：根据 index 决定是全宽还是半宽
                 // 这里为了简单展示，index 0 和 3 是全宽，1 和 2 是并排
                 if (img.type === 'full') {
                    return (
                       <motion.div 
                         key={index}
                         initial={{ opacity: 0, y: 50 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, margin: "-10%" }}
                         transition={{ duration: 1 }}
                         className="w-full aspect-[16/9] overflow-hidden bg-gray-200"
                       >
                          <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
                          <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 text-right">{img.alt}</p>
                       </motion.div>
                    );
                 } else {
                    // 对于半宽图，通常我们会在父级控制 grid，这里简化处理，假设数据结构已经配对好
                    // 实际项目中可以做更复杂的 Masonry
                    return (
                       <motion.div 
                         key={index}
                         initial={{ opacity: 0, y: 50 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, margin: "-10%" }}
                         transition={{ duration: 1 }}
                         className="w-full md:w-[80%] aspect-[4/5] overflow-hidden bg-gray-200 ml-auto" // ml-auto 制造错落感
                       >
                          <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
                          <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">{img.alt}</p>
                       </motion.div>
                    );
                 }
               })}
            </div>

         </div>
      </section>

      {/* 3. The Commercial Anchor */}
      <GetTheLook />
      
      {/* 4. Next Project Navigation (Optional Footer) */}
      <div className="bg-[#F8F5F1] py-20 text-center border-t border-gray-200">
         <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Next Project</p>
         <a href="#" className="font-serif text-4xl md:text-6xl text-[#1a1c18] hover:italic transition-all">
            Toorak Pool House
         </a>
      </div>

      <Footer />
    </main>
  );
}
