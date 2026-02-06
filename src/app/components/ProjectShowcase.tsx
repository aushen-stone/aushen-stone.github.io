// components/ProjectShowcase.tsx
"use client"; // 必须标记为 client component 以使用 framer-motion

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ProjectShowcase() {
  return (
    <section className="bg-[#F0F2E4] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* --- 左侧：沉浸式大图 --- */}
        <div className="relative w-full overflow-hidden group aspect-[4/3] md:aspect-auto md:min-h-[clamp(26rem,60vh,46rem)]">
          {/* 动画层：图片容器 */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} //这种缓动曲线非常有质感
            className="h-full w-full"
          >
            <img
              src="/Application001.webp"
              alt="Aerial view of pool project"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* 暖色遮罩 */}
            <div className="absolute inset-0 bg-[#F0F2E4]/10 mix-blend-multiply"></div>
          </motion.div>
        </div>

        {/* --- 右侧：留白与排版 --- */}
        <div className="flex flex-col justify-center page-padding-x py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 md:px-10 lg:px-16 xl:px-20">
          <motion.div
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } } // 子元素每隔0.15s依次出现
            }}
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="font-serif display-xl text-[#1a1a1a] leading-[1.08] mb-6 sm:mb-8"
            >
              Get Inspired by <br className="hidden lg:block"/>
              <span className="italic font-light opacity-80">Our Favorite</span> Projects
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 sm:mb-12 max-w-md"
            >
              Explore our curated portfolio of residential and commercial spaces, showcasing the timeless beauty of natural stone in harmony with modern architecture.
            </motion.p>

            <motion.div
               variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
            >
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.22em] font-medium text-gray-900 pb-2 border-b border-gray-900 hover:text-gray-600 hover:border-gray-600 transition-all"
              >
                Explore More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
