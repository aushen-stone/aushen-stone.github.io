import { CMS_MANAGED_PAGES, CMS_MANAGED_PROJECTS, CMS_SITE_CONTENT_SYNCED } from "@/data/cms-site.generated";
import { DEFAULT_MANAGED_PAGES, DEFAULT_MANAGED_PROJECTS } from "@/data/site-content.defaults";
import type { ManagedPageKey } from "@/types/siteContent";

export const MANAGED_PROJECTS = CMS_SITE_CONTENT_SYNCED
  ? CMS_MANAGED_PROJECTS
  : DEFAULT_MANAGED_PROJECTS;

export function getManagedPage(key: ManagedPageKey) {
  return CMS_SITE_CONTENT_SYNCED
    ? CMS_MANAGED_PAGES[key] ?? DEFAULT_MANAGED_PAGES[key]
    : null;
}

export const MANAGED_SITE_SYNCED = CMS_SITE_CONTENT_SYNCED;
