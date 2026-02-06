// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_CATEGORIES } from "@/data/categories.generated";
import { SampleCartDrawer } from "@/app/components/cart/SampleCartDrawer";
import { useSampleCart } from "@/app/components/cart/SampleCartProvider";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { lineCount, isDrawerOpen, openDrawer, closeDrawer } = useSampleCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  const menuItems = [
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Projects", href: "/projects", hasDropdown: false },
    { name: "Services", href: "/services", hasDropdown: false },
    { name: "Our Story", href: "/about", hasDropdown: false },
    { name: "Get in Touch", href: "/contact", hasDropdown: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        return;
      }
      if (isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen, isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    closeDrawer();
  }, [isMobileMenuOpen, closeDrawer]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileCloseButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const container = mobileMenuRef.current;
    if (!container) return;

    const getFocusableElements = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
      ).filter((el) => !el.hasAttribute("disabled"));

    const handleTabLoop = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleTabLoop);
    return () => container.removeEventListener("keydown", handleTabLoop);
  }, [isMobileMenuOpen]);

  /** 非首页默认实心 Navbar */
  const shouldBeSolid = isScrolled || !!activeMenu || !isHome;

  const textColorClass = shouldBeSolid ? "text-gray-900" : "text-white";
  const underlineColorClass = shouldBeSolid ? "bg-gray-900" : "bg-white";

  const navBackgroundClass = shouldBeSolid
    ? "bg-[#F8F5F1]/95 backdrop-blur-md border-gray-200/50 shadow-sm"
    : "bg-transparent border-transparent";

  const logoClass = shouldBeSolid
    ? "h-10 opacity-90"
    : "h-14 brightness-0 invert";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBackgroundClass} ${
          isScrolled ? "h-20" : "h-24"
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="h-full px-6 md:px-12 grid grid-cols-[1fr_auto_1fr] items-center gap-4 relative z-50">
          <div className="min-w-0 flex items-center">
            {/* --- Mobile Menu Button --- */}
            <button
              className={`min-[1600px]:hidden z-10 p-2 transition-colors ${textColorClass}`}
              onClick={() => {
                setActiveMenu(null);
                closeDrawer();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu strokeWidth={1.5} size={24} />
            </button>

            {/* --- Desktop Nav --- */}
            <nav className="hidden min-[1600px]:flex min-[1600px]:flex-wrap min-[1600px]:items-center gap-x-8 gap-y-1 min-w-0 pr-6">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center relative py-1"
                  onMouseEnter={() =>
                    item.hasDropdown
                      ? setActiveMenu(item.name)
                      : setActiveMenu(null)
                  }
                >
                  <Link
                    href={item.href}
                    className={`group relative text-xs font-medium uppercase tracking-[0.15em] transition-colors flex items-center gap-1 ${textColorClass}`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          activeMenu === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    <span
                      className={`absolute -bottom-2 left-1/2 w-0 h-[1px] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 ${underlineColorClass}`}
                    />
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* --- Logo (reserved center column) --- */}
          <div className="flex justify-center transition-all duration-500 z-0">
            <Link href="/" className="block cursor-pointer">
              <img
                src="/AushenLogo.webp"
                alt="Aushen"
                className={`object-contain transition-all duration-500 ${logoClass}`}
              />
            </Link>
          </div>

          {/* --- Right Icons --- */}
          <div
            className={`flex items-center justify-end gap-5 md:gap-7 text-xs font-medium uppercase tracking-widest z-10 transition-colors ${textColorClass}`}
          >
            <Link
              href="/contact"
              className="hidden min-[1600px]:block hover:opacity-70 transition-opacity"
            >
              Contact
            </Link>
            <button
              type="button"
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              onClick={() => {
                if (isDrawerOpen) {
                  closeDrawer();
                  return;
                }
                setActiveMenu(null);
                setIsMobileMenuOpen(false);
                openDrawer();
              }}
              aria-label="Open sample cart"
              aria-expanded={isDrawerOpen}
              aria-controls="sample-cart-drawer"
            >
              <ShoppingCart size={20} strokeWidth={1.2} />
              <span>({lineCount})</span>
            </button>
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
              className="absolute top-full left-0 w-full bg-[#F8F5F1] border-b border-gray-200/50 shadow-xl py-12 px-6 md:px-16 hidden min-[1600px]:block"
              onMouseEnter={() => setActiveMenu("Products")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-12">
                {/* Column 1 */}
                <div className="space-y-6">
                  <h4 className="font-serif text-xl italic text-gray-900">
                    By Material
                  </h4>
                  <ul className="space-y-3">
                    {PRODUCT_CATEGORIES.materials.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/products?category=${cat.slug}`}
                          className="block text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <h4 className="font-serif text-xl italic text-gray-900">
                    By Application
                  </h4>
                  <ul className="space-y-3">
                    {PRODUCT_CATEGORIES.applications.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/products?category=${cat.slug}`}
                          className="block text-sm text-gray-600 hover:text-gray-900 hover:pl-2 transition-all"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                  <h4 className="font-serif text-xl italic text-gray-900">
                    Curated Series
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <span className="block text-sm text-gray-600">
                        European Limestone
                      </span>
                    </li>
                    <li>
                      <span className="block text-sm text-gray-600">
                        Organic Steppers
                      </span>
                    </li>
                    <li>
                      <span className="block text-sm text-gray-600">
                        Pool Essentials
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div className="relative min-h-[250px] rounded-sm overflow-hidden group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1621252179027-94459d27d3ee?q=80&w=1000&auto=format&fit=crop"
                    alt="Featured Stone"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs uppercase tracking-widest mb-2">
                      New Arrival
                    </p>
                    <p className="font-serif text-2xl">
                      Italian Porphyry
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[120] min-[1600px]:hidden">
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              id="mobile-nav-drawer"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute left-0 top-0 h-full w-[min(88vw,360px)] bg-[#F8F5F1] shadow-2xl border-r border-gray-200 p-6 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  className="font-serif text-2xl text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Aushen
                </Link>
                <button
                  ref={mobileCloseButtonRef}
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="p-2 border border-gray-300 text-gray-800 hover:border-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="space-y-1 mb-8" aria-label="Main">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-3 border-b border-gray-100 text-sm uppercase tracking-[0.15em] ${
                      pathname === item.href ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="space-y-6">
                <section>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
                    By Material
                  </h4>
                  <ul className="space-y-2">
                    {PRODUCT_CATEGORIES.materials.slice(0, 6).map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-gray-700"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
                    By Application
                  </h4>
                  <ul className="space-y-2">
                    {PRODUCT_CATEGORIES.applications.slice(0, 6).map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-gray-700"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <SampleCartDrawer />
    </>
  );
}
