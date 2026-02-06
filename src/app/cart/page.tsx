"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { useSampleCart } from "@/app/components/cart/SampleCartProvider";
import { SAMPLE_CART_CONTACT_HANDOFF_KEY } from "@/types/cart";

export default function CartPage() {
  const router = useRouter();
  const {
    lines,
    lineCount,
    storageMode,
    removeSample,
    clearSamples,
    closeDrawer,
    buildContactPrefillMessage,
  } = useSampleCart();

  const handleAskForSample = () => {
    const message = buildContactPrefillMessage();
    if (!message) return;

    try {
      window.sessionStorage.setItem(SAMPLE_CART_CONTACT_HANDOFF_KEY, message);
    } catch {
      // Ignore sessionStorage failures and still continue to contact page.
    }

    closeDrawer();
    router.push("/contact?source=sample-cart");
  };

  return (
    <main className="bg-[#F8F5F1] min-h-screen">
      <section className="pt-40 pb-20 px-6 md:px-12 border-b border-gray-200/60">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl text-[#1a1c18] leading-[0.95]">Sample Cart</h1>
          <p className="mt-6 text-sm md:text-base text-gray-600 max-w-2xl">
            Review your selected finishes and submit one sample request from this page.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-gray-500">
            {lineCount} line{lineCount === 1 ? "" : "s"}
          </p>

          {storageMode === "memory" && (
            <p className="mt-4 text-xs text-amber-900 bg-amber-50 border border-amber-300 p-3 inline-block">
              Local storage is unavailable. Cart data will not persist after this session.
            </p>
          )}
        </div>
      </section>

      <section className="py-14 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            {lines.length === 0 ? (
              <div className="border border-gray-200 bg-white p-10 text-center">
                <p className="font-serif text-3xl text-gray-900">No samples selected</p>
                <p className="text-sm text-gray-600 mt-4 mb-8">
                  Add samples from any product detail page first.
                </p>
                <Link
                  href="/products"
                  className="inline-block text-xs uppercase tracking-[0.18em] border border-gray-300 px-6 py-3 hover:border-gray-900 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li
                    key={`${line.productSlug}-${line.finishId}`}
                    className="border border-gray-200 bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-2xl text-gray-900">{line.productName}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mt-3">
                          Finish: {line.finishName}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mt-2">
                          Sample Size: {line.sampleSize}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSample(line.productSlug, line.finishId)}
                        className="p-2 border border-gray-300 text-gray-700 hover:border-gray-900 transition-colors"
                        aria-label={`Remove ${line.productName} ${line.finishName}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-gray-200 bg-white p-6 lg:sticky lg:top-28 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Summary</p>
                <p className="font-serif text-3xl text-gray-900">{lineCount} finish line{lineCount === 1 ? "" : "s"}</p>
              </div>

              <button
                type="button"
                onClick={handleAskForSample}
                disabled={lines.length === 0}
                className="w-full bg-[#1a1c18] text-[#F8F5F1] py-4 px-6 uppercase tracking-[0.2em] text-xs hover:bg-[#3B4034] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                Ask for sample
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={clearSamples}
                disabled={lines.length === 0}
                className="w-full border border-gray-300 py-4 px-6 uppercase tracking-[0.2em] text-xs text-gray-900 hover:border-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear cart
              </button>

              <p className="text-xs text-gray-500 leading-relaxed">
                Sample size is fixed at 200x100mm. Duplicate product+finish combinations are merged into one line.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
