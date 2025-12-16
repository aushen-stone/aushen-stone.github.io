import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SmoothScroll } from "./components/SmoothScroll";
import { GrainOverlay } from "./components/GrainOverlay";
import { Navbar } from "./components/Navbar";
import { PageOffset} from "@/app/components/PageOffset";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aushen Stone",
  description: "Natural stone supplier in Melbourne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${manrope.variable} font-sans antialiased bg-[#F8F5F1] text-gray-900 selection:bg-[#3B4034] selection:text-white`}
      >
        <SmoothScroll>
          {/* 1. 顶部导航（全站） */}
          <Navbar />

          {/* 2. 视觉增强层 */}
          <GrainOverlay />

          {/* 3. 页面主体（给 fixed Navbar 让位） */}
          <PageOffset>{children}</PageOffset>
        </SmoothScroll>
      </body>
    </html>
  );
}
