import { CONTACT_INFO } from "@/data/contact";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function buildLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/AushenShop.webp`,
    logo: `${SITE_URL}/AushenLogo.webp`,
    email: CONTACT_INFO.email,
    telephone: "+61 3 9585 7005",
    address: {
      "@type": "PostalAddress",
      streetAddress: "16A/347 Bay Road",
      addressLocality: "Cheltenham",
      addressRegion: "VIC",
      postalCode: "3192",
      addressCountry: "AU",
    },
  } as const;
}
