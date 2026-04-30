import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Thank You | Aushen Stone",
  description:
    "Thank you for contacting Aushen Stone. Our team will review your enquiry and respond shortly.",
  path: "/thank-you/",
  index: false,
  follow: false,
});

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F1] text-[#1a1c18] selection:bg-[#3B4034] selection:text-white">
      <section className="page-padding-x pt-32 sm:pt-36 md:pt-44 pb-16 sm:pb-20">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#d8d0c4] bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#555b50]">
              <CheckCircle2 size={16} strokeWidth={1.6} />
              Enquiry received
            </div>
            <h1 className="font-serif text-[clamp(2.6rem,8vw,7rem)] leading-[0.9] tracking-normal">
              Thank you.
              <span className="block italic text-[#8a8175]">We&apos;ll be in touch.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#555b50] sm:text-lg">
              Your message has been sent to the Aushen team. We&apos;ll review your
              product selection, sample request, or project enquiry and respond as
              soon as possible.
            </p>
          </div>

          <aside className="border border-[#ddd7cd] bg-white/75 p-6 sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#73796f]">
              While you wait
            </p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Browse products", href: "/products/" },
                { label: "View projects", href: "/projects/" },
                { label: "Visit showroom details", href: "/contact/" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between gap-4 border-b border-[#e5ded3] pb-4 text-sm text-[#1a1c18] transition-colors hover:text-[#3B4034]"
                >
                  <span>{item.label}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
