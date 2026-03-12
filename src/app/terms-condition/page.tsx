import type { Metadata } from "next";
import TermsConditionPageClient from "./TermsConditionPageClient";
import {
  TERMS_CONDITIONS_DESCRIPTION,
  TERMS_CONDITIONS_TITLE,
} from "@/data/legal/terms";
import { buildMetadata } from "@/lib/seo";

const TERMS_CONDITIONS_PATH = "/terms-condition/";

export const metadata: Metadata = buildMetadata({
  title: `${TERMS_CONDITIONS_TITLE} | Aushen Stone`,
  description: TERMS_CONDITIONS_DESCRIPTION,
  path: TERMS_CONDITIONS_PATH,
});

export default function TermsConditionPage() {
  return <TermsConditionPageClient />;
}
