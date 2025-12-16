// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react"; // 引入 ChevronDown
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_CATEGORIES } from "@/data/categories"; // 引入刚才的数据

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 新增：控制 Mega Menu 的显示状态
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    { name: "Products", hasDropdown: true }, // 标记 Products 有下拉
    { name: "Projects", hasDropdown: false },
    { name: "Services", hasDropdown: false },
    { name: "Our Story", hasDropdown: false },
    { name: "Get in Touch", hasDropdown: false }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColorClass = isScrolled || activeMenu ? "text-gray-900" : "text-white";
  const underlineColorClass = isScrolled || activeMenu ? "bg-gray-900" : "bg-white";
  // 当菜单打开时，强制背景变为实心白色(或浅灰)，防止看不清菜单内容
  const navBackgroundClass = isScrolled || activeMenu
    ? "bg-[#F8F5F1]/95 backdrop-blur-md border-gray-200/50 shadow-sm"
    : "bg-transparent border-transparent";

  // Logo 颜色逻辑也需要同步
  const logoClass = isScrolled || activeMenu ? "h-10 opacity-90" : "h-14 brightness-0 invert";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBackgroundClass} ${isScrolled ? "h-20" : "h-24"}`}
        onMouseLeave={() => setActiveMenu(null)} // 鼠标移出整个 Header 区域时关闭菜单
      >
        <div className="h-full px-6 md:px-12 flex items-center justify-between relative z-50">

          {/* --- Desktop Nav --- */}
          <nav className="hidden md:flex gap-10 h-full items-center">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="h-full flex items-center relative"
                onMouseEnter={() => item.hasDropdown ? setActiveMenu(item.name) : setActiveMenu(null)}
              >
                <a
                  href={item.hasDropdown ? "/products" : "#"}
                  className={`group relative text-xs font-medium uppercase tracking-[0.15em] transition-colors flex items-center gap-1 ${textColorClass}`}
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === item.name ? "rotate-180" : ""}`} />}

                  {/* 下划线动画 */}
                  <span className={`absolute -bottom-2 left-1/2 w-0 h-[1px] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 ${underlineColorClass}`}></span>
                </a>
              </div>
            ))}
          </nav>

          {/* ... Mobile Menu Button (保持不变，省略以节省篇幅) ... */}
          <button
             className={`md:hidden z-10 p-2 transition-colors ${textColorClass}`}
             onClick={() => setIsMobileMenuOpen(true)}
           >
             <Menu strokeWidth={1.5} size={24} />
           </button>

          {/* ... Logo (保持不变，应用 logoClass) ... */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-0">
              <Link href="/" className="cursor-pointer block">
                  <img src="/AushenLogo.webp" alt="Aushen" className={`object-contain transition-all duration-500 ${logoClass}`} />
             </Link>
          </div>

          {/* ... Right Icons (保持不变，省略以节省篇幅) ... */}
           <div className={`flex items-center gap-6 md:gap-8 text-xs font-medium uppercase tracking-widest z-10 ml-auto transition-colors ${textColorClass}`}>
            <a href="#" className="hidden md:block hover:opacity-70 transition-opacity">Login</a>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
              <ShoppingCart size={20} strokeWidth={1.2} />
              <span>(0)</span>
            </div>
          </div>
        </div>

        {/* --- MEGA MENU DROPDOWN --- */}
        <AnimatePresence>
          {activeMenu === "Products" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-[#F8F5F1] border-b border-gray-200/50 shadow-xl py-12 px-6 md:px-16"
              onMouseEnter={() => setActiveMenu("Products")} // 鼠标在菜单上时保持打开
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-12">

                {/* Column 1: By Material */}
                <div className="space-y-6">
                  <h4 className="font-serif text-xl text-gray-900 italic">By Material</h4>
                  <ul className="space-y-3">
                    {PRODUCT_CATEGORIES.materials.map((cat) => (
                      <li key={cat.slug}>
                        <a
                          href={`/products?category=${cat.slug}`}
                          className="text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all duration-300 block"
                        >
                          {cat.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: By Application */}
                <div className="space-y-6">
                  <h4 className="font-serif text-xl text-gray-900 italic">By Application</h4>
                  <ul className="space-y-3">
                    {PRODUCT_CATEGORIES.applications.map((cat) => (
                      <li key={cat.slug}>
                        <a
                          href={`/products?category=${cat.slug}`}
                          className="text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all duration-300 block"
                        >
                          {cat.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Collections / Series (预留) */}
                <div className="space-y-6">
                   <h4 className="font-serif text-xl text-gray-900 italic">Curated Series</h4>
                   <ul className="space-y-3">
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all">European Limestone</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all">Organic Steppers</a></li>
                      <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all">Pool Essentials</a></li>
                   </ul>
                </div>

                {/* Column 4: Feature Image (视觉重心) */}
                <div className="relative h-full min-h-[250px] rounded-sm overflow-hidden group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1621252179027-94459d27d3ee?q=80&w=1000&auto=format&fit=crop"
                    alt="Featured Stone"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs uppercase tracking-widest mb-2">New Arrival</p>
                    <p className="font-serif text-2xl">Italian Porphyry</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Mobile Menu Overlay ... (保持不变) */}
    </>
  );
}
