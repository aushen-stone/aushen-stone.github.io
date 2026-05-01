export type FeaturedReview = {
  author: string;
  meta: string;
  quote: string;
};

export const TRUST_SIGNALS = {
  google: {
    rating: "5.0",
    reviewCount: 20,
    label: "Google Reviews",
    profileUrl: "https://g.page/aushenstone",
  },
  experience: {
    label: "20 years of natural stone experience",
    shortLabel: "20 years",
  },
  showroom: {
    label: "Cheltenham showroom",
    detail: "16a/347 Bay Rd, Cheltenham VIC 3192",
  },
  distributor: {
    label: "Distributor of Chemforce, HIDE and FormBoss",
    brands: ["Chemforce", "HIDE", "FormBoss"],
  },
} as const;

export const FEATURED_GOOGLE_REVIEWS: FeaturedReview[] = [
  {
    author: "Lisa Q",
    meta: "Google review",
    quote: "Beautiful blue-grey tones bring the backyard to life.",
  },
  {
    author: "Joan Hutchings",
    meta: "Google review",
    quote: "Great customer service by Hanna, who was very product knowledgeable.",
  },
  {
    author: "Robyn Shiels",
    meta: "Google review",
    quote: "Very knowledgeable and down to earth staff.",
  },
];
