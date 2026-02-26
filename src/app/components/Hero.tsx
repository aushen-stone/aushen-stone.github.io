// components/Hero.tsx
"use client"; // 动效组件必须在客户端运行

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "./animations/FadeIn"; // 引入第一步做好的通用组件

export function Hero() {
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
          src="/AushenShop.webp"
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
              <span>Find your crafted</span>
            </FadeIn>

            {/* 第二行文字：延迟 0.4s 浮现 (去掉了br，因为FadeIn是块级元素，自带换行) */}
            <FadeIn delay={0.4} className="block">
              <span>architectural surfaces.</span>
            </FadeIn>
          </h1>

          {/* 按钮：延迟 0.6s 最后浮现 */}
          <FadeIn delay={0.6} className="mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/contact"
              className="group w-full sm:w-auto border border-white/80 px-[var(--btn-px)] py-[var(--btn-py)] text-white text-[11px] sm:text-sm uppercase tracking-[0.16em] sm:tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
            >
              Make Appointments
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </FadeIn>
        </div>

      </div>
    </div>
  );
}
