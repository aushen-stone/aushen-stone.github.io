import type { ManagedPage, ManagedProject } from "@/types/siteContent";

export const CMS_MANAGED_PAGES: Partial<Record<ManagedPage["key"], ManagedPage>> = {};
export const CMS_MANAGED_PROJECTS: ManagedProject[] = [];
export const CMS_SITE_CONTENT_SYNCED = false;
