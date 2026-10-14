"use client";

import Link from "next/link";
import { useEffect } from "react";

const SERVICES_QUOTE_TARGET = "/services/?quote=1";

export default function ServicesQuoteRedirect() {
  useEffect(() => {
    window.location.replace(SERVICES_QUOTE_TARGET);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5F1] page-padding-x pt-36 sm:pt-44 pb-24">
      <p className="text-sm text-gray-600">
        Taking you to our quote form…{" "}
        <Link href={SERVICES_QUOTE_TARGET} className="text-[#1a1c18] underline underline-offset-4">
          Continue
        </Link>
      </p>
    </main>
  );
}
