"use client";

import { useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ArrowUpRight, MoveDown } from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK DATA: 模拟真实的高端住宅/商业项目 ---
const PROJECTS = [
  {
    id: 1,
    title: "Brighton Residence",
    category: "Residential",
    location: "Melbourne, VIC",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop",
    aspect: "aspect-[16/10]", // 横构图：大气
    gridArea: "left", // 放在左边
  },
  {
    id: 2,
    title: "Toorak Pool House",
    category: "Landscape",
    location: "Toorak, VIC",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[3/4]", // 竖构图：精致
    gridArea: "right", // 放在右边，且下沉
  },
  {
    id: 3,
    title: "Mornington Peninsula Winery",
    category: "Commercial",
    location: "Mornington, VIC",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    aspect: "aspect-[16/9]", // 电影感宽幅
    gridArea: "left",
  },
  {
    id: 4,
    title: "Hawthorn Courtyard",
    category: "Residential",
    location: "Hawthorn, VIC",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    aspect: "aspect-[4/5]",
    gridArea: "right",
  },
  {
    id: 5,
    title: "Sorrento Coastal Home",
    category: "Residential",
    location: "Sorrento, VIC",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    aspect: "aspect-[3/2]",
    gridArea: "center", // 特殊：居中大图
  }
];

const CATEGORIES = ["All", "Residential", "Commercial", "Landscape"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // 简单的筛选逻辑
  const filteredProjects = activeCategory === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <Navbar />

      {/* --- 1. Header: The Dark Curtain (深色序幕) --- */}
      <section className="relative bg-[#1a1c18] pt-40 pb-32 px-6 md:px-12 overflow-hidden">
        
        {/* 背景氛围：噪点 + 微光 */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-[#2A2D28] to-transparent opacity-30 pointer-events-none"></div>

        <div className="max-w-[1800px] mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-3xl">
            <span className="block text-white/40 text-[10px] uppercase tracking-[0.3em] mb-6 pl-1">
              Selected Works 2020 — 2024
            </span>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-[#F8F5F1] leading-[0.85] tracking-tight">
              Curated <br/> <span className="italic text-white/30 ml-4 md:ml-12">Spaces</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-8">
             <p className="text-white/60 text-sm font-light max-w-xs text-right leading-relaxed hidden md:block">
               A showcase of natural stone in its finest form. From private residences to public landmarks.
             </p>
             {/* 滚动提示 */}
             <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-widest animate-pulse">
                Explore <MoveDown size={14} />
             </div>
          </div>
        </div>
      </section>

      {/* --- 2. Filter Bar (Sticky) --- */}
      <div className="sticky top-20 z-40 bg-[#F8F5F1]/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-500 border
                    ${activeCategory === cat 
                      ? "bg-[#1a1c18] text-white border-[#1a1c18]" 
                      : "bg-transparent text-gray-500 border-transparent hover:border-gray-200 hover:text-gray-900"}
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

      {/* --- 3. The Staggered Gallery (交错画廊) --- */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="flex flex-col gap-20 md:gap-32">
           
           {/* 这里的逻辑是：手动模拟“交错”感。
             我们遍历项目，根据它的 index 决定它是靠左、靠右，还是居中。
             这比 CSS Grid 更容易控制“叙事节奏”。
           */}
           {filteredProjects.map((project, index) => {
             // 简单的布局逻辑：
             // 偶数 (0, 2, 4...) -> 靠左 (或居中)
             // 奇数 (1, 3, 5...) -> 靠右
             // 特殊：index 为 4 (第5个) 强制居中
             
             let alignmentClass = "mr-auto"; // 默认靠左
             if (index % 2 !== 0) alignmentClass = "ml-auto md:mt-32"; // 奇数靠右，且下沉 (margin-top)
             if (project.gridArea === "center") alignmentClass = "mx-auto md:mt-20"; // 居中
             
             // 宽度控制：居中图大一点，两侧图适中
             let widthClass = project.gridArea === "center" ? "max-w-5xl" : "max-w-4xl";

             return (
               <div 
                 key={project.id} 
                 className={`relative w-full ${widthClass} ${alignmentClass} group cursor-pointer`}
               >
                 
                 {/* Image Container */}
                 <div className={`relative w-full ${project.aspect} overflow-hidden bg-gray-200`}>
                   <img 
                     src={project.image} 
                     alt={project.title} 
                     className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                   />
                   
                   {/* Hover Overlay: 极简遮罩，增加电影感 */}
                   <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 </div>

                 {/* Caption: 悬浮在图片下方或侧边，像杂志注脚 */}
                 <div className="mt-6 flex justify-between items-end border-t border-gray-900/10 pt-4">
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl text-[#1a1c18] mb-1 group-hover:italic transition-all">
                        {project.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                        {project.location} — {project.category}
                      </p>
                    </div>
                    
                    {/* Arrow Button */}
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#1a1c18] group-hover:text-[#1a1c18] group-hover:rotate-45 transition-all duration-500">
                       <ArrowUpRight size={18} strokeWidth={1} />
                    </div>
                 </div>

               </div>
             );
           })}

        </div>
        
        {/* End of List */}
        <div className="mt-32 text-center">
           <p className="font-serif italic text-gray-400 text-xl">More projects coming soon.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
