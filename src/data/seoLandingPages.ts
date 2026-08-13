import {
  CMS_SEO_LANDING_PAGES,
  CMS_SEO_LANDING_PAGES_SYNCED,
} from "@/data/cms-seo-pages.generated";
import { DEFAULT_SEO_LANDING_PAGES } from "@/data/seo-landing-page.defaults";

const defaultsByKey = new Map(
  DEFAULT_SEO_LANDING_PAGES.map((page) => [`${page.kind}:${page.slug}`, page]),
);

export const SEO_LANDING_PAGES = CMS_SEO_LANDING_PAGES_SYNCED
  ? CMS_SEO_LANDING_PAGES.map((page) => {
      const fallback = defaultsByKey.get(`${page.kind}:${page.slug}`);
      return {
        ...fallback,
        ...page,
        catalogueDescription: page.catalogueDescription || fallback?.catalogueDescription || page.intro,
      };
    })
  : DEFAULT_SEO_LANDING_PAGES;
