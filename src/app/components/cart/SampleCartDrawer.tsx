"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useSampleCart } from "./SampleCartProvider";

export function SampleCartDrawer() {
  const {
    lines,
    lineCount,
    isDrawerOpen,
    storageMode,
    removeSample,
    clearSamples,
    closeDrawer,
  } = useSampleCart();

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    closeButtonRef.current?.focus();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[130]">
          <motion.button
            type="button"
            aria-label="Close sample cart overlay"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          <motion.aside
            id="sample-cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Sample cart"
            className="absolute right-0 top-0 h-full w-[min(92vw,420px)] bg-[#F8F5F1] border-l border-gray-200 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-gray-700" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Sample Cart</p>
                  <p className="text-sm text-gray-900">{lineCount} item{lineCount === 1 ? "" : "s"}</p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close sample cart"
                className="p-2 border border-gray-300 text-gray-800 hover:border-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
              >
                <X size={16} />
              </button>
            </div>

            {storageMode === "memory" && (
              <div className="mx-6 mt-4 p-3 border border-amber-300 bg-amber-50 text-amber-900 text-xs leading-relaxed">
                Local storage is unavailable. Cart data is temporary for this session only.
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <p className="font-serif text-2xl text-gray-900">Your sample cart is empty</p>
                  <p className="text-sm text-gray-600 max-w-[18rem]">
                    Add samples from a product detail page, then request them from the cart page.
                  </p>
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="text-xs uppercase tracking-[0.18em] border border-gray-300 px-5 py-3 hover:border-gray-900 transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => (
                    <li
                      key={`${line.productSlug}-${line.finishId}`}
                      className="border border-gray-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg text-gray-900">{line.productName}</p>
                          <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mt-2">
                            Finish: {line.finishName}
                          </p>
                          <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mt-1">
                            Sample: {line.sampleSize}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSample(line.productSlug, line.finishId)}
                          className="p-2 border border-gray-300 text-gray-700 hover:border-gray-900 transition-colors"
                          aria-label={`Remove ${line.productName} ${line.finishName}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-6 py-5 border-t border-gray-200 space-y-3">
              <button
                type="button"
                onClick={clearSamples}
                disabled={lines.length === 0}
                className="w-full border border-gray-300 py-3 text-xs uppercase tracking-[0.18em] text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-900 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full bg-[#1a1c18] text-[#F8F5F1] py-3 text-center text-xs uppercase tracking-[0.18em] hover:bg-[#3B4034] transition-colors"
              >
                View Cart
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
