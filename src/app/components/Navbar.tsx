// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = ["Products", "Projects", "Services", "Our Story", "Get in Touch"];

  useEffect(() => {
    const handleScroll = () => {
      // 这里稍微调大了阈值到 60px，让用户滚动一点距离后再变化，体验更稳定
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 关键改动 1：定义动态颜色变量 ---
  // 根据滚动状态，决定文字是黑色还是白色
  const textColorClass = isScrolled ? "text-gray-900" : "text-white";
  // 根据滚动状态，决定 Hover 时下划线的颜色
  const underlineColorClass = isScrolled ? "bg-gray-900" : "bg-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "h-20 bg-[#F8F5F1]/80 backdrop-blur-md border-gray-200/50 shadow-sm" // 滚动后：磨砂米色背景
            : "h-24 bg-transparent border-transparent" // 初始：全透明背景
        }`}
      >
        <div className="h-full px-6 md:px-12 flex items-center justify-between relative">

          {/* --- 左侧菜单 (Desktop) --- */}
          <nav className="hidden md:flex gap-10 z-10">
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                // --- 关键改动 2：应用动态文字颜色 ---
                className={`group relative text-xs font-medium uppercase tracking-[0.15em] transition-colors ${textColorClass}`}
              >
                {item}
                {/* --- 关键改动 3：应用动态下划线颜色 --- */}
                <span className={`absolute -bottom-2 left-1/2 w-0 h-[1px] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 ${underlineColorClass}`}></span>
              </a>
            ))}
          </nav>

          {/* --- 移动端菜单按钮 (Mobile) --- */}
          {/* --- 关键改动 4：应用动态颜色到汉堡按钮 --- */}
          <button
            className={`md:hidden z-10 p-2 transition-colors ${textColorClass}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu strokeWidth={1.5} size={24} />
          </button>

          {/* --- 中间 Logo (绝对居中) --- */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-0">
            <a href="/">
               {/* --- 关键改动 5：Logo 的动态变色 --- */}
               {/* 我们假设你的 Logo 原图是深色的。
                   当在顶部时 (!isScrolled)，我们加上 'brightness-0 invert' 滤镜，强制把它变成纯白色。
                   当滚动后 (isScrolled)，去掉滤镜，恢复原色，并稍微降低透明度。
               */}
               <img
                 src="/AushenLogo.webp"
                 alt="Aushen"
                 className={`object-contain transition-all duration-500 ${
                   isScrolled ? "h-10 opacity-90" : "h-14 brightness-0 invert"
                 }`}
               />
            </a>
          </div>

          {/* --- 右侧功能区 --- */}
          {/* --- 关键改动 6：应用动态颜色到右侧图标 --- */}
          <div className={`flex items-center gap-6 md:gap-8 text-xs font-medium uppercase tracking-widest z-10 ml-auto transition-colors ${textColorClass}`}>
            <a href="#" className="hidden md:block hover:opacity-70 transition-opacity">
              Login
            </a>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
              <ShoppingCart size={20} strokeWidth={1.2} />
              <span>(0)</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- 全屏移动端菜单 Overlay (保持不变) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#1a1c18] z-[60] flex flex-col items-center justify-center text-[#F8F5F1]"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 p-2 hover:rotate-90 transition-transform duration-300 text-white"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <ul className="flex flex-col items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <a
                    href="#"
                    className="font-serif text-4xl md:text-5xl hover:text-white/60 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="absolute bottom-12 text-white/30 text-xs uppercase tracking-widest">
              Aushen Stone
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
