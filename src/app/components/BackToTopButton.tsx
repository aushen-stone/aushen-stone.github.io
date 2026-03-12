"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number | null = null;

    const updateVisibility = () => {
      frameId = null;
      const nextIsVisible = window.scrollY >= window.innerHeight;

      if (nextIsVisible === isVisibleRef.current) return;

      isVisibleRef.current = nextIsVisible;
      setIsVisible(nextIsVisible);
    };

    const scheduleVisibilityCheck = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateVisibility);
    };

    scheduleVisibilityCheck();

    window.addEventListener("scroll", scheduleVisibilityCheck, { passive: true });
    window.addEventListener("resize", scheduleVisibilityCheck);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleVisibilityCheck);
      window.removeEventListener("resize", scheduleVisibilityCheck);
    };
  }, []);

  const handleScrollToTop = () => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Back to top"
          onClick={handleScrollToTop}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed right-[var(--page-x)] bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[100] inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1a1c18]/10 bg-[#F8F5F1]/92 text-[#1a1c18] shadow-[0_14px_34px_-20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors hover:border-[#1a1c18]/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] sm:h-12 sm:w-12"
        >
          <ArrowUp size={18} strokeWidth={1.8} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
