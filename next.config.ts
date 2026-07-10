import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // QA can use an isolated cache so it never corrupts a developer's active .next directory.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
