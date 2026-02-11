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
  const [isMediumNavTight, setIsMediumNavTight] = useState(false);
  const desktopGridRef = useRef<HTMLDivElement | null>(null);
  const logoColumnRef = useRef<HTMLDivElement | null>(null);
  const rightClusterRef = useRef<HTMLDivElement | null>(null);
  const desktopRowOneRef = useRef<HTMLDivElement | null>(null);
  const desktopRowTwoRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  const desktopMenuItems = [
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Projects", href: "/projects", hasDropdown: false },
    { name: "Services", href: "/services", hasDropdown: false },
    { name: "Our Story", href: "/about", hasDropdown: false },
  ];

  const mobileMenuItems = [
    ...desktopMenuItems,
    { name: "Get in Touch", href: "/contact", hasDropdown: false },
  ];
  const desktopSplitIndex = Math.ceil(desktopMenuItems.length / 2);
  const desktopMenuFirstRow = desktopMenuItems.slice(0, desktopSplitIndex);
  const desktopMenuSecondRow = desktopMenuItems.slice(desktopSplitIndex);

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
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleViewportModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
        return;
      }

      setActiveMenu(null);
    };

    desktopMediaQuery.addEventListener("change", handleViewportModeChange);
    return () =>
      desktopMediaQuery.removeEventListener("change", handleViewportModeChange);
  }, []);

  useEffect(() => {
    const mediumDesktopQuery = window.matchMedia(
      "(min-width: 1024px) and (max-width: 1535px)"
    );
    let rafId: number | null = null;

    const evaluateMediumNavDensity = () => {
      const gridEl = desktopGridRef.current;
      const logoEl = logoColumnRef.current;
      const rightEl = rightClusterRef.current;
      const rowOneEl = desktopRowOneRef.current;
      const rowTwoEl = desktopRowTwoRef.current;
      if (!gridEl || !logoEl || !rightEl || !rowOneEl || !rowTwoEl) return;

      const gridRect = gridEl.getBoundingClientRect();
      const logoRect = logoEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();
      const leftAvailable = Math.max(0, logoRect.left - gridRect.left - 16);
      const rightAvailable = Math.max(0, gridRect.right - logoRect.right - 16);
      const leftNeeded = Math.max(rowOneEl.scrollWidth, rowTwoEl.scrollWidth);
      const rightNeeded = rightRect.width;
      const leftOverflow = leftNeeded - leftAvailable;
      const rightOverflow = rightNeeded - rightAvailable;

      setIsMediumNavTight((current) => {
        if (!current) {
          // Tight mode should only kick in when there is a real collision risk.
          return leftOverflow > 4 || rightOverflow > 14;
        }
        // Relax sooner once there is clear breathing room to avoid staying compact too long.
        if (leftOverflow <= -10 && rightOverflow <= -6) {
          return false;
        }
        return current;
      });
    };

    const scheduleDensityCheck = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        if (mediumDesktopQuery.matches) {
          evaluateMediumNavDensity();
        } else {
          setIsMediumNavTight((current) => (current ? false : current));
        }
      });
    };

    const observedElements = [
      desktopGridRef.current,
      logoColumnRef.current,
      rightClusterRef.current,
      desktopRowOneRef.current,
      desktopRowTwoRef.current,
    ];
    const resizeObserver = new ResizeObserver(() => {
      scheduleDensityCheck();
    });

    observedElements.forEach((el) => {
      if (el) resizeObserver.observe(el);
    });

    window.addEventListener("resize", scheduleDensityCheck);
    mediumDesktopQuery.addEventListener("change", scheduleDensityCheck);
    scheduleDensityCheck();

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleDensityCheck);
      mediumDesktopQuery.removeEventListener("change", scheduleDensityCheck);
    };
  }, []);

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
    ? "h-[var(--nav-logo-h-solid)] opacity-90"
    : "h-[var(--nav-logo-h-transparent)] brightness-0 invert";
  const desktopNavLinkSizingClass = isMediumNavTight
    ? "text-[11px] xl:text-[12px] tracking-[0.11em] xl:tracking-[0.14em]"
    : "text-[12px] xl:text-[13.5px] tracking-[0.13em] xl:tracking-[0.16em]";
  const desktopRowGapClass = isMediumNavTight
    ? "gap-x-4 xl:gap-x-5.5"
    : "gap-x-6 xl:gap-x-7";
  const desktopRowSpacingClass = isMediumNavTight ? "space-y-[3px]" : "space-y-[6px]";
  const mediumLogoWidthClass = isMediumNavTight
    ? "lg:w-[clamp(104px,15vw,170px)]"
    : "lg:w-[clamp(114px,17vw,188px)]";
  const rightClusterSizingClass = isMediumNavTight
    ? "gap-2.5 sm:gap-3 lg:gap-3.5 text-[10px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.12em]"
    : "gap-2.5 sm:gap-3 lg:gap-4.5 text-[10px] sm:text-[11px] lg:text-xs tracking-[0.1em] sm:tracking-[0.13em]";

  const renderDesktopNavItem = (item: {
    name: string;
    href: string;
    hasDropdown: boolean;
  }) => (
    <div
      key={item.name}
      className="flex items-center relative py-0.5"
      onMouseEnter={() =>
        item.hasDropdown ? setActiveMenu(item.name) : setActiveMenu(null)
      }
    >
      <Link
        href={item.href}
        className={`group relative whitespace-nowrap font-medium uppercase transition-colors flex items-center gap-1 ${desktopNavLinkSizingClass} ${textColorClass}`}
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
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBackgroundClass} ${
          isScrolled ? "h-[var(--nav-h-scrolled)]" : "h-[var(--nav-h-expanded)]"
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div
          ref={desktopGridRef}
          className="h-full page-padding-x grid grid-cols-[auto_minmax(0,1fr)_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 md:gap-4 relative z-50"
        >
          <div className="min-w-0 flex items-center">
            {/* --- Mobile Menu Button --- */}
            <button
              className={`lg:hidden z-10 p-1.5 sm:p-2 transition-colors shrink-0 ${textColorClass}`}
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
            <nav className="hidden lg:block min-w-0 pr-2 xl:pr-4 2xl:pr-6">
              <div className={`2xl:hidden ${desktopRowSpacingClass}`}>
                <div ref={desktopRowOneRef} className={`flex items-center ${desktopRowGapClass}`}>
                  {desktopMenuFirstRow.map(renderDesktopNavItem)}
                </div>
                <div ref={desktopRowTwoRef} className={`flex items-center ${desktopRowGapClass}`}>
                  {desktopMenuSecondRow.map(renderDesktopNavItem)}
                </div>
              </div>
              <div className="hidden 2xl:flex items-center gap-x-6">
                {desktopMenuItems.map(renderDesktopNavItem)}
              </div>
            </nav>
          </div>

          {/* --- Logo (reserved center column) --- */}
          <div
            ref={logoColumnRef}
            className="min-w-0 flex justify-center transition-all duration-500 z-0"
          >
            <Link href="/" className="block cursor-pointer">
              <img
                src="/AushenLogo.webp"
                alt="Aushen"
                className={`w-[clamp(96px,28vw,180px)] md:w-[clamp(110px,18vw,190px)] ${mediumLogoWidthClass} 2xl:w-[clamp(120px,20vw,240px)] max-w-full object-contain transition-all duration-500 ${logoClass}`}
              />
            </Link>
          </div>

          {/* --- Right Icons --- */}
          <div
            ref={rightClusterRef}
            className={`flex items-center justify-end ${rightClusterSizingClass} 2xl:gap-6 2xl:text-xs font-medium uppercase 2xl:tracking-[0.18em] z-10 transition-colors ${textColorClass}`}
          >
            <Link
              href="/contact"
              className="hidden lg:block hover:opacity-70 transition-opacity"
            >
              Contact
            </Link>
            <button
              type="button"
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-70 transition-opacity whitespace-nowrap"
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
              <span className="text-[11px] sm:text-xs">({lineCount})</span>
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
              className="absolute top-full left-0 w-full bg-[#F8F5F1] border-b border-gray-200/50 shadow-xl py-12 px-6 md:px-16 hidden lg:block"
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
          <div className="fixed inset-0 z-[120] lg:hidden">
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
                {mobileMenuItems.map((item) => (
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
