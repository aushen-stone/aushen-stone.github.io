import type { LegalSection } from "./terms";

export const PRIVACY_POLICY_TITLE = "Privacy Policy";
export const PRIVACY_POLICY_LAST_UPDATED = "28 April 2026";
export const PRIVACY_POLICY_DESCRIPTION =
  "Read how Aushen Stone collects, uses, stores, discloses, and protects personal information from website visitors, customers, suppliers, and project contacts.";

export const PRIVACY_POLICY_SUMMARY = [
  {
    label: "What we collect",
    value:
      "Contact details, project requirements, product selections, order and delivery details, and website usage data.",
  },
  {
    label: "Why we use it",
    value:
      "To answer enquiries, prepare quotes, support sample and product requests, manage orders, improve the website, and meet business or legal obligations.",
  },
  {
    label: "How to contact us",
    value:
      "Privacy access, correction, and complaint requests can be sent to info@aushenstone.com.au.",
  },
] as const;

export const PRIVACY_POLICY_SECTIONS: readonly LegalSection[] = [
  {
    id: "scope",
    number: 1,
    title: "Who We Are and Scope",
    items: [
      {
        text:
          "This Privacy Policy explains how Stone World Australia Pty Ltd T/A Aushen Stone & Tile, trading as Aushen Stone, collects, holds, uses, and discloses personal information.",
      },
      {
        text:
          "It applies to personal information collected through this website, product and sample enquiries, showroom visits, phone and email communications, quotes, orders, deliveries, services, supplier dealings, and recruitment enquiries.",
      },
      {
        text:
          "This policy should be read alongside any specific notice we give at the point of collection and our Terms & Conditions where those terms apply to a transaction.",
      },
    ],
  },
  {
    id: "information-we-collect",
    number: 2,
    title: "Personal Information We Collect",
    items: [
      {
        text:
          "The kinds of personal information we may collect depend on how you deal with us and may include:",
        items: [
          {
            text:
              "contact details such as your name, email address, phone number, postal address, business name, and role;",
          },
          {
            text:
              "project details such as site suburb, intended application, product preferences, finish, size, quantity, delivery requirements, and messages you send to us;",
          },
          {
            text:
              "order, quote, invoice, payment, account, delivery, and service history information;",
          },
          {
            text:
              "sample-cart and product-enquiry information that helps us understand which materials or accessories you are considering;",
          },
          {
            text:
              "technical information about your website visit, including device, browser, approximate location, pages viewed, referral source, and interaction events where analytics tools are used; and",
          },
          {
            text:
              "employment-related information if you contact us about work opportunities.",
          },
        ],
      },
      {
        text:
          "We generally do not seek sensitive information. If you provide sensitive information to us voluntarily, we will handle it only for the purpose for which it was provided or as otherwise permitted by law.",
      },
    ],
  },
  {
    id: "how-we-collect",
    number: 3,
    title: "How We Collect Information",
    items: [
      {
        text:
          "We usually collect personal information directly from you when you submit a contact form, make a product or sample enquiry, visit or call the showroom, request a quote, place an order, email us, or interact with our team.",
      },
      {
        text:
          "We may also collect information from people acting on your behalf, such as builders, landscapers, architects, designers, installers, delivery providers, suppliers, referrers, or other project contacts.",
      },
      {
        text:
          "Website information may be collected automatically through cookies, Google Tag Manager, analytics tools, and local browser storage used to remember sample-cart selections, product enquiry context, and product browsing return context.",
      },
      {
        text:
          "Where credit, trade account, payment, debt recovery, or legal processes are involved, we may collect information from credit reporting bodies, payment providers, professional advisers, or publicly available sources where permitted by law.",
      },
    ],
  },
  {
    id: "why-we-use",
    number: 4,
    title: "Why We Use and Disclose Information",
    items: [
      {
        text:
          "We collect, hold, use, and disclose personal information for purposes connected with our business, including to:",
        items: [
          { text: "respond to enquiries and provide product guidance;" },
          { text: "prepare quotes, samples, orders, invoices, and delivery arrangements;" },
          {
            text:
              "support customers, builders, designers, architects, landscapers, and suppliers during a project;",
          },
          { text: "manage accounts, payments, warranties, returns, and service records;" },
          {
            text:
              "operate, maintain, secure, and improve our website, showroom operations, product catalogue, and customer experience;",
          },
          {
            text:
              "send relevant updates or marketing communications where permitted, with an opportunity to opt out;",
          },
          { text: "assess job enquiries and supplier relationships;" },
          {
            text:
              "meet legal, accounting, insurance, dispute-resolution, safety, regulatory, and debt recovery obligations.",
          },
        ],
      },
    ],
  },
  {
    id: "disclosure",
    number: 5,
    title: "Who We May Disclose Information To",
    items: [
      {
        text:
          "We may disclose personal information to people or organisations where reasonably necessary for the purposes above, including:",
        items: [
          { text: "our staff, contractors, related business contacts, and authorised representatives;" },
          {
            text:
              "installers, fabricators, delivery providers, suppliers, manufacturers, or other project participants who need the information to assist with a request, quote, order, or service;",
          },
          {
            text:
              "website hosting, email, form-processing, customer-management, analytics, payment, accounting, and IT service providers;",
          },
          {
            text:
              "professional advisers such as accountants, insurers, auditors, debt recovery providers, and lawyers;",
          },
          {
            text:
              "credit reporting bodies or credit providers where trade credit or account assessment is relevant; and",
          },
          {
            text:
              "courts, regulators, law enforcement bodies, or other parties where required or permitted by law.",
          },
        ],
      },
      {
        text:
          "We do not sell personal information. If we use personal information for direct marketing, you may ask us to stop using your information for that purpose.",
      },
    ],
  },
  {
    id: "cookies-and-storage",
    number: 6,
    title: "Cookies, Analytics, and Local Storage",
    items: [
      {
        text:
          "Our website may use cookies, Google Tag Manager, analytics tools, and similar technologies to understand website performance, improve browsing experience, measure traffic, and support security or diagnostics.",
      },
      {
        text:
          "The website also uses browser storage for functional features, including sample-cart selections, product-detail contact handoff, and returning customers to their filtered product list after viewing a product detail page.",
      },
      {
        text:
          "You can control cookies through your browser settings. Some website features may not work as intended if cookies or browser storage are disabled.",
      },
    ],
  },
  {
    id: "overseas-disclosure",
    number: 7,
    title: "Overseas Disclosure",
    items: [
      {
        text:
          "Some of the service providers and platforms we use for website hosting, analytics, email, forms, business systems, or technical support may store or process personal information outside Australia.",
      },
      {
        text:
          "Where it is practicable to identify likely overseas locations, those locations may include the United States and other countries where our technology providers or their infrastructure partners operate.",
      },
      {
        text:
          "When we disclose personal information to an overseas recipient, we take reasonable steps required by Australian privacy law to protect that information.",
      },
    ],
  },
  {
    id: "security-retention",
    number: 8,
    title: "Security and Retention",
    items: [
      {
        text:
          "We take reasonable steps to protect personal information from misuse, interference, loss, unauthorised access, modification, and disclosure.",
      },
      {
        text:
          "Security measures may include access controls, system safeguards, staff procedures, supplier controls, and secure business systems appropriate to the information we hold.",
      },
      {
        text:
          "We keep personal information only for as long as it is needed for the purpose for which it was collected, for related business purposes, or as required by law. When information is no longer required, we take reasonable steps to destroy or de-identify it.",
      },
    ],
  },
  {
    id: "access-correction",
    number: 9,
    title: "Access and Correction",
    items: [
      {
        text:
          "You may request access to personal information we hold about you, or ask us to correct information you believe is inaccurate, incomplete, or out of date.",
      },
      {
        text:
          "Please contact us by email, phone, or post using the details below. We may need to verify your identity before responding to a request.",
      },
      {
        text:
          "If we cannot provide access or make a requested correction, we will explain why where required or appropriate.",
      },
    ],
  },
  {
    id: "complaints",
    number: 10,
    title: "Privacy Complaints",
    items: [
      {
        text:
          "If you have a privacy concern or complaint, please contact us first so we can review and respond to the issue.",
      },
      {
        text:
          "We aim to acknowledge privacy complaints within seven (7) days and take reasonable steps to make a decision within thirty (30) days of receiving the complaint.",
      },
      {
        text:
          "If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner at www.oaic.gov.au.",
      },
    ],
  },
  {
    id: "contact-and-updates",
    number: 11,
    title: "Contact and Policy Updates",
    items: [
      {
        text:
          "Privacy contact: Aushen Stone & Tile, 16a/347 Bay Rd, Cheltenham VIC 3192. Email info@aushenstone.com.au or call 03-9585 7005.",
      },
      {
        text:
          "We may update this Privacy Policy from time to time to reflect changes in our business, website, service providers, or legal obligations.",
      },
      {
        text:
          "The latest version will be published on this page with the last updated date shown above.",
      },
    ],
  },
];
