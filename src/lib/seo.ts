import type { Metadata } from "next";

export const SITE_URL = "https://aushenstone.com.au";
export const SITE_NAME = "Aushen Stone";
export const DEFAULT_DESCRIPTION =
  "Aushen Stone supplies premium natural stone products and project support across Melbourne, from selection to delivery.";

const BASE_URL = SITE_URL.replace(/\/$/, "");

function normalizeRoutePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function canonicalUrl(path: string): string {
  const normalizedPath = normalizeRoutePath(path);
  return `${BASE_URL}${normalizedPath}`;
}

type BuildMetadataInput = {
  title: string;
  path: string;
  description?: string;
  index?: boolean;
  follow?: boolean;
};

export function buildMetadata({
  title,
  path,
  description = DEFAULT_DESCRIPTION,
  index = true,
  follow = true,
}: BuildMetadataInput): Metadata {
  const url = canonicalUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index,
      follow,
    },
  };
}
