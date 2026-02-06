// components/BestSellers.tsx
"use client"; // 动效组件需要客户端渲染

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type Variants } from "framer-motion"; // 引入 motion
import { FadeIn } from "./animations/FadeIn"; // 引入基础动效组件

// 假数据
const PRODUCTS = [
  {
    id: 1,
    name: "Bluestone Crazy Paver",
    price: "A$75.00",
    image: "https://images.unsplash.com/photo-1621260405282-3d76378e906c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Ruysch Arrangement",
    price: "A$575.00",
    image: "https://images.unsplash.com/photo-1615591963282-e42152862d85?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Boulevardier Bouquet",
    price: "A$575.00",
    image: "https://images.unsplash.com/photo-1596627685600-b883086eb015?q=80&w=1000&auto=format&fit=crop",
  },
];

const smoothEase: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

// 定义交错动画参数
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 核心：每个子元素间隔 0.2 秒依次出现
      delayChildren: 0.1,   // 整体延迟 0.1 秒开始
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 }, // 初始：透明且向下偏移
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase } // 使用同样的优雅曲线
  },
};

export function BestSellers() {
  return (
    <section className="py-16 sm:py-24 page-padding-x bg-white">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr] gap-10 sm:gap-16 lg:gap-24">

        {/* --- 左侧文案区域 (整体作为一个块浮现) --- */}
        <FadeIn className="flex flex-col justify-center items-start space-y-8">
          <div>
            <h2 className="font-serif display-lg text-[#1a1a1a] mb-5 sm:mb-6">
              Best sellers
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Transform your backyard with our gorgeous best selling natural stone pieces.
            </p>
          </div>

          <Link
            href="/products"
            className="group relative inline-block text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] font-medium text-gray-900 pb-2 border-b border-gray-300 hover:border-gray-900 transition-colors cursor-pointer"
          >
            Shop Best Sellers
          </Link>
        </FadeIn>

        {/* --- 右侧产品区域 (交错出现) --- */}
        <div className="relative">

          {/* 顶部小箭头 */}
          <div className="absolute -top-10 sm:-top-12 right-0 hidden sm:flex gap-4 text-gray-400">
             <ChevronLeft size={20} className="cursor-pointer hover:text-gray-900 transition-colors" />
             <ChevronRight size={20} className="cursor-pointer hover:text-gray-900 transition-colors" />
          </div>

          {/* 产品网格容器：应用 containerVariants */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // 进入视口一点点后触发
          >
            {PRODUCTS.map((product) => (
              // 单个产品卡片：应用 itemVariants
              <motion.div key={product.id} className="group cursor-pointer" variants={itemVariants}>

                {/* 图片容器 */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pb-6 sm:pb-8">
                    <button className="bg-black text-white text-[10px] uppercase tracking-[0.14em] sm:tracking-widest px-5 sm:px-6 py-3 hover:bg-gray-800 transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* 产品信息 */}
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-900 font-medium">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.price}</p>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
