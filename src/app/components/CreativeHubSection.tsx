// components/CreativeHubSection.tsx
"use client";

import Marquee from "react-fast-marquee";
import { motion, type Variants } from "framer-motion";

export function CreativeHubSection() {

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  // 定义通用的上浮动画变体
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } },
  };

  return (
    <section className="bg-[#3B4034] text-[#F8F5F1] py-16 md:py-24 overflow-hidden">

      {/* --- 1. 无限滚动标题区域 (整体淡入) --- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="mb-20 border-y border-white/10 py-4"
      >
        <Marquee gradient={false} speed={40} className="overflow-hidden">
          <span className="text-6xl md:text-8xl lg:text-9xl font-serif uppercase tracking-tight mx-4">
            Our Space, Your Creative Hub <span className="mx-4 font-light text-white/50">—</span>
          </span>
          <span className="text-6xl md:text-8xl lg:text-9xl font-serif uppercase tracking-tight mx-4">
            Our Space, Your Creative Hub <span className="mx-4 font-light text-white/50">—</span>
          </span>
        </Marquee>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* --- 2. 空间图片展示 (Image Grid) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20"
        >

          {/* 左图 */}
          <motion.div variants={fadeInUp} className="aspect-[4/3] overflow-hidden bg-white/5 group">
             <img
               src="/Homeowners.webp"
               alt="Creative Hub Showroom Area"
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
             />
          </motion.div>

          {/* 右图 */}
          <motion.div variants={fadeInUp} className="aspect-[4/3] overflow-hidden bg-white/5 group">
             <img
               src="/Professionals.webp"
               alt="Material Selection Table"
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
             />
          </motion.div>
        </motion.div>


        {/* --- 3. 客户细分文案 (Segment Content) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
             visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 border-t border-white/10 pt-16"
        >

          {/* 左侧：Home Owners */}
          <motion.div variants={fadeInUp} className="flex flex-col items-start space-y-6">
            <h3 className="font-serif text-3xl md:text-4xl text-white">
              Home Owners
            </h3>
            <p className="text-white/70 italic font-light text-sm md:text-base">
              Feeling overwhelmed and stressed of your garden renovation?
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Our experienced garden design team is here ready to guide you through the material selection process, ensuring your vision comes to life effortlessly.
            </p>
            <button className="mt-4 px-8 py-3 border border-white/30 text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5F1] hover:text-[#3B4034] hover:border-[#F8F5F1] transition-all duration-300">
              Book A Consultation
            </button>
          </motion.div>

          {/* 右侧：Professionals */}
          <motion.div variants={fadeInUp} className="flex flex-col items-start space-y-6">
            <h3 className="font-serif text-3xl md:text-4xl text-white">
              Professionals
            </h3>
            <p className="text-white/70 italic font-light text-sm md:text-base">
              Need an inspiring space with all material samples ready to discuss the project with your clients?
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Whether you are a builder, landscaper, or designer, we are committed to offering a space free of charge, with coffee on us.
            </p>
            <button className="mt-4 px-8 py-3 border border-white/30 text-xs uppercase tracking-[0.2em] hover:bg-[#F8F5F1] hover:text-[#3B4034] hover:border-[#F8F5F1] transition-all duration-300">
              Book The Space
            </button>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
