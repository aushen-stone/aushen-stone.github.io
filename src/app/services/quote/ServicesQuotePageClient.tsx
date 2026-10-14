"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { QuickEnquiryForm } from "@/app/components/QuickEnquiryForm";

const SERVICES_QUOTE_SOURCE = "services-fabrication";

const buildFabricationQuoteMessage = (customerNotes: string) =>
  [
    "Stone fabrication quote request from services page:",
    `Page: ${typeof window === "undefined" ? "/services/quote/" : window.location.href}`,
    "",
    "Customer notes:",
    customerNotes.trim() || "-",
  ].join("\n");

export default function ServicesQuotePageClient() {
  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#1a1c18] selection:text-white">
      <section className="page-padding-x pt-32 sm:pt-36 md:pt-44 pb-20 sm:pb-28">
        <div className="max-w-[1600px] mx-auto">
          <Link
            href="/services/"
            className="mb-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500 transition-colors hover:text-[#1a1c18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18]"
          >
            <ArrowLeft size={14} />
            Stone Fabrication &amp; Cutting Service
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="block text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-5">
                Fabrication quote
              </span>
              <h1 className="font-serif text-3xl md:text-5xl text-[#1a1c18] leading-tight">
                Tell Us What You Need Cut
              </h1>
              <p className="mt-5 max-w-md text-sm text-gray-600 font-light leading-loose">
                Send your stone, dimensions, quantity and timing and our team will come
                back to you with a quote.
              </p>
            </div>
            <div className="lg:col-span-7 rounded-xl border border-[#E6E0D8] bg-white p-5 sm:p-7">
              <QuickEnquiryForm
                source={SERVICES_QUOTE_SOURCE}
                userType="fabrication-quote"
                buildMessage={buildFabricationQuoteMessage}
                submitLabel="Send Quote Request"
                notesPlaceholder="Stone, dimensions, quantity, edge profile, timing"
                idPrefix="services-quote"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
