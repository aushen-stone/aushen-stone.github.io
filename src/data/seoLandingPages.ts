import {
  CMS_SEO_LANDING_PAGES,
  CMS_SEO_LANDING_PAGES_SYNCED,
} from "@/data/cms-seo-pages.generated";
import { DEFAULT_SEO_LANDING_PAGES } from "@/data/seo-landing-page.defaults";

export const SEO_LANDING_PAGES = CMS_SEO_LANDING_PAGES_SYNCED
  ? CMS_SEO_LANDING_PAGES
  : DEFAULT_SEO_LANDING_PAGES;
