import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Aushen Stone | Showroom & Enquiries",
  description:
    "Get in touch with Aushen Stone for product enquiries, sample requests, and showroom consultations in Cheltenham, Victoria.",
  path: "/contact/",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
