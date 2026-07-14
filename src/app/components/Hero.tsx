// components/Hero.tsx
"use client"; // 动效组件必须在客户端运行

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CMS_LEGACY_PAGES } from "@/data/cms-site.generated";
import { FadeIn } from "./animations/FadeIn"; // 引入第一步做好的通用组件

export function Hero() {
  const content = CMS_LEGACY_PAGES.home?.hero;
  const titleLines = content?.titleLines?.length
    ? content.titleLines
    : ["Find your crafted", "architectural surfaces."];
  const containerRef = useRef(null);

  // 监听滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // 只要 Hero 在视口内就开始计算
  });

  // 定义视差参数：
  // 当滚动进度从 0% 变到 100% 时，背景图向下移动 20% (比前景慢，产生深度感)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  // 可选：滚动时稍微变暗，增强沉浸感
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[var(--hero-min-height)] overflow-hidden">

      {/* 1. 背景图层 (应用视差动画) */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={content?.image || "/AushenShop.webp"}
          alt="Showroom Interior"
          // 关键点：scale-110 稍微放大图片，防止视差滚动时露出边缘空白
          className="w-full h-full object-cover brightness-[0.85] scale-110"
        />
      </motion.div>

      {/* 2. 内容层 */}
      <div className="relative z-10 h-full max-w-[1920px] mx-auto page-padding-x pt-[calc(var(--nav-h-expanded)+var(--nav-logo-h-transparent)+env(safe-area-inset-top)+1rem)] pb-16 sm:pt-[calc(var(--nav-h-expanded)+var(--nav-logo-h-transparent)+env(safe-area-inset-top)+1.25rem)] sm:pb-20 md:pt-[calc(var(--nav-h-expanded)+var(--nav-logo-h-transparent)+env(safe-area-inset-top)+1.5rem)] md:pb-24 lg:pt-24 lg:pb-24 flex flex-col justify-start lg:justify-center">

        {/* 标题区域 */}
        <div className="max-w-2xl">
          <h1 className="font-serif display-hero text-white leading-[1.05]">
            {/* 第一行文字：延迟 0.2s 浮现 */}
            <FadeIn delay={0.2} className="block">
              <span>{titleLines[0]}</span>
            </FadeIn>

            {/* 第二行文字：延迟 0.4s 浮现 (去掉了br，因为FadeIn是块级元素，自带换行) */}
            <FadeIn delay={0.4} className="block">
              <span>{titleLines[1] ?? ""}</span>
            </FadeIn>
          </h1>

          <FadeIn delay={0.55} className="mt-6 max-w-xl">
            <p className="text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              {content?.text || "Natural stone, paving, pool coping and wall cladding advice from the Aushen showroom team."}
            </p>
          </FadeIn>

          {/* 按钮：延迟 0.7s 最后浮现 */}
          <FadeIn delay={0.7} className="mt-8 sm:mt-10 md:mt-12">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={content?.primaryHref || "/contact/"}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 bg-white px-[var(--btn-px)] py-[var(--btn-py)] text-[11px] uppercase tracking-[0.16em] text-black transition-all duration-300 hover:bg-[#F8F5F1] sm:w-auto sm:text-sm sm:tracking-widest"
              >
                {content?.primaryLabel || "Talk to a Stone Specialist"}
                <ArrowRight className="h-4 w-4 opacity-80 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={content?.secondaryHref || "/products/"}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 border border-white/80 px-[var(--btn-px)] py-[var(--btn-py)] text-[11px] uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-auto sm:text-sm sm:tracking-widest"
              >
                {content?.secondaryLabel || "Browse Products"}
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </div>
          </FadeIn>
        </div>

      </div>
    </div>
  );
}
