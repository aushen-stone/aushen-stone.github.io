import type { Metadata } from "next";
import Script from "next/script";
import { BackToTopButton } from "./components/BackToTopButton";
import { GrainOverlay } from "./components/GrainOverlay";
import { Navbar } from "./components/Navbar";
import { PageOffset } from "@/app/components/PageOffset";
import { SampleCartProvider } from "./components/cart/SampleCartProvider";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, canonicalUrl } from "@/lib/seo";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NNH55QC";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Natural Stone Supplier in Melbourne`,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: canonicalUrl("/"),
  },
  openGraph: {
    title: `${SITE_NAME} | Natural Stone Supplier in Melbourne`,
    description: DEFAULT_DESCRIPTION,
    url: canonicalUrl("/"),
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Natural Stone Supplier in Melbourne`,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
        >
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body
        className="font-sans antialiased bg-[#F8F5F1] text-gray-900 selection:bg-[#3B4034] selection:text-white"
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SampleCartProvider>
          {/* 1. 顶部导航（全站） */}
          <Navbar />

          {/* 2. 视觉增强层 */}
          <GrainOverlay />

          {/* 3. 页面主体（给 fixed Navbar 让位） */}
          <PageOffset>{children}</PageOffset>

          <BackToTopButton />
        </SampleCartProvider>
      </body>
    </html>
  );
}
