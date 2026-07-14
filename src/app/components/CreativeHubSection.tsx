// components/CreativeHubSection.tsx
"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee";
import { motion, type Variants } from "framer-motion";
import { CMS_LEGACY_PAGES } from "@/data/cms-site.generated";

export function CreativeHubSection() {
  const content = CMS_LEGACY_PAGES.home?.creativeHub;
  const images = content?.images?.length === 2 ? content.images : [
    { src: "/Homeowners.webp", alt: "Creative Hub Showroom Area" },
    { src: "/Professionals.webp", alt: "Material Selection Table" },
  ];
  const audiences = content?.audiences?.length === 2 ? content.audiences : [
    { title: "Home Owners", lead: "Feeling overwhelmed and stressed of your garden renovation?", text: "Our experienced garden design team is here ready to guide you through the material selection process, ensuring your vision comes to life effortlessly.", label: "Book A Consultation", href: "/contact" },
    { title: "Professionals", lead: "Need an inspiring space with all material samples ready to discuss the project with your clients?", text: "Whether you are a builder, landscaper, or designer, we are committed to offering a space free of charge, with coffee on us.", label: "Book The Space", href: "/contact" },
  ];

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  // 定义通用的上浮动画变体
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } },
  };

  return (
    <section className="bg-[#3B4034] text-[#F8F5F1] py-14 sm:py-16 md:py-24 overflow-hidden">

      {/* --- 1. 无限滚动标题区域 (整体淡入) --- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="mb-14 sm:mb-20 border-y border-white/10 py-3 sm:py-4"
      >
        <Marquee gradient={false} speed={40} className="overflow-hidden">
          <span className="text-[clamp(2rem,10vw,5.4rem)] font-serif uppercase tracking-tight mx-4">
            {content?.marquee || "Our Space, Your Creative Hub"} <span className="mx-4 font-light text-white/50">—</span>
          </span>
          <span className="text-[clamp(2rem,10vw,5.4rem)] font-serif uppercase tracking-tight mx-4">
            {content?.marquee || "Our Space, Your Creative Hub"} <span className="mx-4 font-light text-white/50">—</span>
          </span>
        </Marquee>
      </motion.div>

      <div className="max-w-[1400px] mx-auto page-padding-x">

        {/* --- 2. 空间图片展示 (Image Grid) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-14 sm:mb-20"
        >

          {/* 左图 */}
          <motion.div variants={fadeInUp} className="aspect-[4/3] overflow-hidden bg-white/5 group">
             <img
               src={images[0].src}
               alt={images[0].alt}
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
             />
          </motion.div>

          {/* 右图 */}
          <motion.div variants={fadeInUp} className="aspect-[4/3] overflow-hidden bg-white/5 group">
             <img
               src={images[1].src}
               alt={images[1].alt}
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
          className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-20 border-t border-white/10 pt-12 sm:pt-16"
        >

          {/* 左侧：Home Owners */}
          <motion.div variants={fadeInUp} className="flex flex-col items-start space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white">
              {audiences[0].title}
            </h3>
            <p className="text-white/70 italic font-light text-sm md:text-base">
              {audiences[0].lead}
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {audiences[0].text}
            </p>
            <Link
              href={audiences[0].href}
              className="mt-4 w-full sm:w-auto px-6 sm:px-8 py-3 border border-white/30 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] hover:bg-[#F8F5F1] hover:text-[#3B4034] hover:border-[#F8F5F1] transition-all duration-300"
            >
              {audiences[0].label}
            </Link>
          </motion.div>

          {/* 右侧：Professionals */}
          <motion.div variants={fadeInUp} className="flex flex-col items-start space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white">
              {audiences[1].title}
            </h3>
            <p className="text-white/70 italic font-light text-sm md:text-base">
              {audiences[1].lead}
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {audiences[1].text}
            </p>
            <Link
              href={audiences[1].href}
              className="mt-4 w-full sm:w-auto px-6 sm:px-8 py-3 border border-white/30 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] hover:bg-[#F8F5F1] hover:text-[#3B4034] hover:border-[#F8F5F1] transition-all duration-300"
            >
              {audiences[1].label}
            </Link>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
