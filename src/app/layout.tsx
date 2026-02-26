import type { Metadata } from "next";
import { SmoothScroll } from "./components/SmoothScroll";
import { GrainOverlay } from "./components/GrainOverlay";
import { Navbar } from "./components/Navbar";
import { PageOffset } from "@/app/components/PageOffset";
import { SampleCartProvider } from "./components/cart/SampleCartProvider";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, canonicalUrl } from "@/lib/seo";
import "./globals.css";

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
      <body
        className="font-sans antialiased bg-[#F8F5F1] text-gray-900 selection:bg-[#3B4034] selection:text-white"
      >
        <SmoothScroll>
          <SampleCartProvider>
            {/* 1. 顶部导航（全站） */}
            <Navbar />

            {/* 2. 视觉增强层 */}
            <GrainOverlay />

            {/* 3. 页面主体（给 fixed Navbar 让位） */}
            <PageOffset>{children}</PageOffset>
          </SampleCartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
