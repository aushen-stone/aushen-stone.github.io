"use client";

import { useRef } from "react";
import { Footer } from "@/app/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";

// === 组件: 杂志风分屏 Hero (Split Editorial Hero) ===
function EditorialHero() {
  return (
    <section className="relative min-h-[var(--hero-min-height)] md:min-h-screen bg-[#F8F5F1] pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 page-padding-x flex flex-col md:flex-row items-center overflow-hidden">

      {/* 左侧：留白与文字 (像杂志排版) */}
      <div className="w-full md:w-1/2 relative z-10 flex flex-col justify-center h-full md:pr-12">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
         >
           <span className="text-[#3B4034] text-xs uppercase tracking-[0.3em] mb-6 block">Since 2003</span>
           <h1 className="font-serif text-[clamp(2.2rem,8vw,6rem)] text-[#1a1c18] leading-[0.95] mb-6 sm:mb-8">
             The Stone <br/>
             <span className="italic text-gray-400">Keeper.</span>
           </h1>
           <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed max-w-md">
             We are not just suppliers. We are curators of geology, bridging the gap between the ancient quarry and the modern home.
           </p>
         </motion.div>

         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-8 sm:mt-12 flex items-center gap-4 text-[#1a1c18]/40"
         >
            <span className="text-[10px] uppercase tracking-widest">Scroll the timeline</span>
            <div className="w-8 h-[1px] bg-[#1a1c18]/20"></div>
         </motion.div>
      </div>

      {/* 右侧：不规则影像 (Organic Shape) */}
      <div className="w-full md:w-1/2 h-[40vh] min-h-[260px] sm:min-h-[320px] md:h-[80vh] md:min-h-0 relative mt-10 sm:mt-12 md:mt-0">
         <motion.div
           initial={{ scale: 0.9, opacity: 0, borderRadius: "50%" }}
           animate={{ scale: 1, opacity: 1, borderRadius: "300px 300px 0 0" }} // 拱门形状，很建筑感
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="w-full h-full overflow-hidden shadow-2xl relative"
         >
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop"
              alt="Raw Nature"
              className="w-full h-full object-cover"
            />
            {/* 噪点遮罩，增加胶片感 */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}></div>
         </motion.div>
      </div>
    </section>
  );
}

// === 组件: 橄榄绿宣言块 (The Manifesto Block) ===
function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]); // Parallax

  return (
    <section className="bg-[#2C3025] text-[#F0F2E4] py-24 sm:py-32 md:py-40 page-padding-x relative overflow-hidden">
       {/* 背景纹理 */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F0F2E4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

       <div className="max-w-[1200px] mx-auto text-center relative z-10" ref={ref}>
          <motion.div style={{ y }}>
             <p className="font-serif italic text-[clamp(1.7rem,5vw,3.8rem)] leading-tight opacity-90">
               &quot;We reject 90% of what we find. Not out of arrogance, but out of respect for the home you are building.&quot;
             </p>
             <div className="mt-12">
               <span className="inline-block px-4 py-2 border border-[#F0F2E4]/30 rounded-full text-[10px] uppercase tracking-[0.2em]">Our Philosophy</span>
             </div>
          </motion.div>
       </div>
    </section>
  );
}

// === 组件: 时光流 (The Timeline Stream) ===
function TimelineSection() {
  const items = [
    {
      year: "The Origin",
      title: "Global Sourcing",
      desc: "It started with a trip to Europe's ancient quarries. We realized that true quality can't be ordered from a catalog; it must be touched.",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop",
      align: "left"
    },
    {
      year: "The Standard",
      title: "The 10% Rule",
      desc: "We established our strict selection criteria early on. Consistency in tone, durability in texture. If we wouldn't use it, we don't sell it.",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", // 岩石纹理
      align: "right"
    },
    {
      year: "The Place",
      title: "Bayside Roots",
      desc: "We planted our roots in Melbourne's Bayside. A showroom built not to display products, but to spark conversations.",
      image: "https://images.unsplash.com/photo-1631679706909-1e44ddd2a96b?q=80&w=800&auto=format&fit=crop", // 展厅
      align: "left"
    }
  ];

  return (
    <section className="bg-[#E8E6E1] py-20 sm:py-28 md:py-32 page-padding-x relative">
       <div className="max-w-[1200px] mx-auto relative">

          {/* 中央时间线 (仅在大屏显示) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-300 hidden md:block transform -translate-x-1/2"></div>

          <div className="flex flex-col gap-20 sm:gap-24 md:gap-32">
             {items.map((item, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 0.8 }}
                 className={`flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-24 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}
               >
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 relative group">
                     <div className="aspect-[4/5] overflow-hidden bg-gray-200 shadow-xl relative z-10 transform transition-transform duration-700 group-hover:scale-105">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                     </div>
                     {/* 装饰性的偏移背景框 */}
                     <div className={`absolute top-4 ${item.align === 'left' ? '-left-4' : '-right-4'} w-full h-full border border-gray-400 z-0`}></div>
                  </div>

                  {/* Text Side */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                     <span className="text-xs font-bold uppercase tracking-widest text-[#3B4034] mb-2 block">{item.year}</span>
                     <h3 className="font-serif text-[clamp(1.8rem,5vw,3rem)] text-[#1a1c18] mb-4 sm:mb-6">{item.title}</h3>
                     <p className="text-gray-600 leading-loose font-light max-w-sm mx-auto md:mx-0">
                       {item.desc}
                     </p>
                  </div>
               </motion.div>
             ))}
          </div>

       </div>
    </section>
  );
}

// === 组件: 签名 (保持白色背景的干净结尾) ===
function SignatureBlock() {
  return (
    <section className="bg-[#F8F5F1] py-20 sm:py-28 md:py-32 text-center border-t border-white">
       <div className="max-w-2xl mx-auto page-padding-x">
          <p className="font-serif text-2xl text-gray-400 italic mb-8">
            &quot;We invite you to experience the difference yourself.&quot;
          </p>
          {/* Jun 的签名复用之前的 */}
          <div className="w-32 h-16 mx-auto opacity-80">
             <svg viewBox="0 0 200 100" fill="none" className="text-[#1a1c18]">
                <path d="M50,20 C50,20 60,15 70,20 C70,20 60,60 60,70 C60,85 40,85 40,70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M80,50 C80,50 80,70 85,75 C90,80 100,80 105,75 C110,70 110,50 110,50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M120,50 C120,50 120,75 120,75 M120,60 C130,50 145,50 145,75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M30,90 C80,85 160,85 180,95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
       </div>
    </section>
  );
}

export default function OurStoryPage() {
  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#3B4034] selection:text-[#F0F2E4]">
      {/* 1. Light Editorial Hero */}
      <EditorialHero />

      {/* 2. Timeline (Warm Grey Background) */}
      <TimelineSection />

      {/* 3. Manifesto (Olive Green Break) */}
      <Manifesto />

      {/* 4. Signature (Clean White) */}
      <SignatureBlock />

      <Footer />
    </main>
  );
}
