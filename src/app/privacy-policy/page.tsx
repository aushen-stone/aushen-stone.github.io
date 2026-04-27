import type { Metadata } from "next";
import PrivacyPolicyPageClient from "./PrivacyPolicyPageClient";
import {
  PRIVACY_POLICY_DESCRIPTION,
  PRIVACY_POLICY_TITLE,
} from "@/data/legal/privacy";
import { buildMetadata } from "@/lib/seo";

const PRIVACY_POLICY_PATH = "/privacy-policy/";

export const metadata: Metadata = buildMetadata({
  title: `${PRIVACY_POLICY_TITLE} | Aushen Stone`,
  description: PRIVACY_POLICY_DESCRIPTION,
  path: PRIVACY_POLICY_PATH,
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient />;
}
