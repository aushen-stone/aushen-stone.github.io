import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, PackageCheck, Star } from "lucide-react";
import {
  FEATURED_GOOGLE_REVIEWS,
  TRUST_SIGNALS,
  type FeaturedReview,
} from "@/data/trustSignals";

type TrustSignalStripProps = {
  className?: string;
  context?: "homepage" | "contact" | "about";
  showReviews?: boolean;
};

function GoogleStars() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-0.5 text-[#8b6f35]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={13} fill="currentColor" strokeWidth={1.5} />
      ))}
    </span>
  );
}

function ReviewQuote({ review }: { review: FeaturedReview }) {
  return (
    <figure className="border-t border-[#d8d0c4] pt-5">
      <blockquote className="font-serif text-lg leading-snug text-[#1a1c18]">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#73796f]">
        {review.author} / {review.meta}
      </figcaption>
    </figure>
  );
}

export function GoogleReviewBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={TRUST_SIGNALS.google.profileUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Read Aushen Stone ${TRUST_SIGNALS.google.rating} ${TRUST_SIGNALS.google.label}`}
      className={`group inline-flex items-center gap-3 rounded-sm text-[#1a1c18] transition-colors hover:text-[#3B4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cfc6b9] bg-white/70">
        <Star size={16} fill="currentColor" strokeWidth={1.5} className="text-[#8b6f35]" />
      </span>
      <span>
        <span className="flex items-center gap-2 text-sm font-medium">
          {TRUST_SIGNALS.google.rating} {TRUST_SIGNALS.google.label}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-[#73796f]">
          {TRUST_SIGNALS.google.reviewCount} customer reviews
        </span>
      </span>
    </a>
  );
}

export function TrustSignalStrip({
  className = "",
  context = "homepage",
  showReviews = false,
}: TrustSignalStripProps) {
  const isCompact = context === "contact";
  const sectionClassName = [isCompact ? "" : "page-padding-x bg-[#F8F5F1]", className]
    .filter(Boolean)
    .join(" ");
  const innerClassName = isCompact
    ? undefined
    : "mx-auto max-w-[1400px] border-y border-[#ddd7cd] py-10 sm:py-12";

  return (
    <section
      className={sectionClassName || undefined}
      aria-label="Aushen Stone trust signals"
    >
      <div className={innerClassName}>
        {!isCompact && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#73796f]">
                Proof points
              </p>
              <h2 className="mt-3 max-w-3xl font-serif text-[clamp(1.7rem,4vw,3.2rem)] leading-tight text-[#1a1c18]">
                Selection support backed by real showroom experience.
              </h2>
            </div>
            <GoogleReviewBadge />
          </div>
        )}

        <div
          className={`grid gap-6 ${
            isCompact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          <div className="border-t border-[#ddd7cd] pt-5">
            <div className="mb-4 flex items-center gap-2 text-[#8b6f35]">
              <GoogleStars />
            </div>
            <p className="font-serif text-2xl text-[#1a1c18]">
              {TRUST_SIGNALS.google.rating} {TRUST_SIGNALS.google.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#666d62]">
              Rated by customers on Google from {TRUST_SIGNALS.google.reviewCount} reviews.
            </p>
          </div>

          <div className="border-t border-[#ddd7cd] pt-5">
            <BadgeCheck size={18} className="mb-4 text-[#3B4034]" />
            <p className="font-serif text-2xl text-[#1a1c18]">
              {TRUST_SIGNALS.experience.shortLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#666d62]">
              Natural stone experience for Melbourne homes, pools, gardens and trade projects.
            </p>
          </div>

          <div className="border-t border-[#ddd7cd] pt-5">
            <MapPin size={18} className="mb-4 text-[#3B4034]" />
            <p className="font-serif text-2xl text-[#1a1c18]">
              {TRUST_SIGNALS.showroom.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#666d62]">
              Compare stone, finishes and accessory details at {TRUST_SIGNALS.showroom.detail}.
            </p>
          </div>

          <div className="border-t border-[#ddd7cd] pt-5">
            <PackageCheck size={18} className="mb-4 text-[#3B4034]" />
            <p className="font-serif text-2xl text-[#1a1c18]">Accessory distributor</p>
            <p className="mt-2 text-sm leading-6 text-[#666d62]">
              {TRUST_SIGNALS.distributor.label}.
            </p>
          </div>
        </div>

        {showReviews && (
          <div
            className={`mt-10 grid gap-6 ${
              isCompact ? "grid-cols-1" : "md:grid-cols-3"
            }`}
          >
            {FEATURED_GOOGLE_REVIEWS.map((review) => (
              <ReviewQuote key={review.author} review={review} />
            ))}
          </div>
        )}

        {context === "about" && (
          <div className="mt-10 flex flex-col gap-5 border-t border-[#ddd7cd] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-serif text-2xl leading-snug text-[#1a1c18]">
              Visit the Cheltenham showroom to compare stone, finishes and project details
              with the Aushen team.
            </p>
            <Link
              href="/contact/"
              className="inline-flex w-max items-center gap-3 bg-[#1a1c18] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3B4034]"
            >
              Visit showroom
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
