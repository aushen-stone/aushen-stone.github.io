export type SeoLandingPageKind = "material" | "application";

export type SeoLandingPageSection = {
  id: string;
  heading: string;
  body: string;
};

export type SeoLandingPageFaq = {
  id: string;
  question: string;
  answer: string;
};

export type SeoLandingPageLink = {
  id: string;
  label: string;
  href: string;
};

export type SeoLandingPage = {
  slug: string;
  kind: SeoLandingPageKind;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Short copy shown under the heading on the filterable product catalogue. */
  catalogueDescription?: string;
  serviceArea: string;
  productSlugs: string[];
  sections: SeoLandingPageSection[];
  faqs: SeoLandingPageFaq[];
  exploreLinks: SeoLandingPageLink[];
};
