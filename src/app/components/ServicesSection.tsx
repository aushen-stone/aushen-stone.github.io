// components/ServicesSection.tsx
"use client";

import { ScanLine, Layers, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { FadeIn } from "./animations/FadeIn";

const SERVICES = [
  {
    id: 1,
    title: "Templating Service",
    description: "Precision digital templating for perfect fits.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop", 
    icon: ScanLine, 
  },
  {
    id: 2,
    title: "Local Processing",
    description: "Expert stone cutting and finishing in-house.",
    image: "/local-processing.jpg", 
    icon: Layers, 
  },
  {
    id: 3,
    title: "Design Consultation",
    description: "Collaborative sessions to bring vision to life.",
    image: "/design_consulation.png", 
    icon: Users, 
  },
];

const smoothEase: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

// 复用同样的动画配置，保持全站统一感
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }, // 这里稍微慢一点点，0.3s 间隔
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: smoothEase } 
  },
};

export function ServicesSection() {
  return (
    <section className="py-16 sm:py-24 md:py-32 page-padding-x bg-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- 头部文案 --- */}
        <FadeIn className="text-center mb-14 sm:mb-20 space-y-4">
          <h2 className="font-serif display-lg text-[#1a1a1a]">
            What we do
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            At Aushen, we do <span className="font-bold text-gray-800">more</span> than just sell stone and tiles.
          </p>
        </FadeIn>

        {/* --- 三列布局容器 --- */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {SERVICES.map((service) => (
            // 单个服务项
            <motion.div key={service.id} className="group flex flex-col items-center text-center cursor-default" variants={itemVariants}>
              
              {/* 1. 图片容器 */}
              <div className="relative w-full aspect-square overflow-hidden mb-6 sm:mb-8 bg-gray-100">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-[1.05]"
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#4A3B32]/20 transition-colors duration-300 pointer-events-none"></div>
              </div>

              {/* 2. 图标连接线 */}
              <div className="w-px h-8 bg-gray-200 mb-4 group-hover:bg-[#4A3B32] transition-colors duration-300"></div>

              {/* 3. 图标 */}
              <div className="mb-4 text-gray-400 group-hover:text-[#4A3B32] transition-colors duration-300 transform group-hover:-translate-y-1">
                <service.icon strokeWidth={1} size={40} />
              </div>

              {/* 4. 文字标题 */}
              <h3 className="font-serif text-lg sm:text-xl text-[#1a1a1a] mb-2">
                {service.title}
              </h3>
              
              {/* 5. 补充说明 */}
              <p className="text-xs text-gray-400 max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-2 group-hover:translate-y-0">
                {service.description}
              </p>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
