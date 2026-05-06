"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Loader2, ShoppingCart, Trash2, X } from "lucide-react";
import { useSampleCart } from "./SampleCartProvider";
import {
  isContactEndpointConfigured,
  pushContactConversionEvent,
  submitContactEnquiry,
} from "@/lib/contactSubmission";

type SampleRequestFormState = {
  firstName: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
};

type SampleRequestSubmitState =
  | { kind: "idle"; message: "" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const SAMPLE_DRAWER_CONTACT_SOURCE = "sample-drawer";

export function SampleCartDrawer() {
  const {
    lines,
    lineCount,
    isDrawerOpen,
    storageMode,
    removeSample,
    clearSamples,
    closeDrawer,
    buildContactPrefillMessage,
  } = useSampleCart();

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SampleRequestSubmitState>({
    kind: "idle",
    message: "",
  });
  const [formState, setFormState] = useState<SampleRequestFormState>({
    firstName: "",
    email: "",
    phone: "",
    notes: "",
    website: "",
  });
  const headerSummary =
    submitState.kind === "success"
      ? "Request sent"
      : `${lineCount} finish line${lineCount === 1 ? "" : "s"}`;

  useEffect(() => {
    if (!isDrawerOpen) return;
    closeButtonRef.current?.focus();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (lines.length > 0 && submitState.kind === "success") {
      setSubmitState({ kind: "idle", message: "" });
    }
  }, [lines.length, submitState.kind]);

  useEffect(() => {
    if (isDrawerOpen || submitState.kind !== "success") return;
    setSubmitState({ kind: "idle", message: "" });
  }, [isDrawerOpen, submitState.kind]);

  const updateField =
    (field: keyof SampleRequestFormState) =>
    (value: string): void => {
      setFormState((previous) => ({ ...previous, [field]: value }));
      if (submitState.kind !== "idle") {
        setSubmitState({ kind: "idle", message: "" });
      }
    };

  const buildSampleRequestMessage = () => {
    const sampleMessage = buildContactPrefillMessage();
    const notes = formState.notes.trim();

    return [
      "Sample request from drawer:",
      "",
      sampleMessage || "-",
      "",
      "Customer notes:",
      notes || "-",
    ].join("\n");
  };

  const handleSubmitSampleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lines.length === 0) return;

    if (!isContactEndpointConfigured()) {
      setSubmitState({
        kind: "error",
        message:
          "Contact endpoint is not configured. Please call or email Aushen directly.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ kind: "idle", message: "" });

    try {
      await submitContactEnquiry({
        firstName: formState.firstName,
        email: formState.email,
        phone: formState.phone,
        message: buildSampleRequestMessage(),
        userType: "sample-request",
        source: SAMPLE_DRAWER_CONTACT_SOURCE,
        website: formState.website,
      });

      pushContactConversionEvent(SAMPLE_DRAWER_CONTACT_SOURCE);
      clearSamples();
      setFormState({
        firstName: "",
        email: "",
        phone: "",
        notes: "",
        website: "",
      });
      setSubmitState({
        kind: "success",
        message:
          "Thanks, your sample request has been sent. Our team will contact you shortly.",
      });
    } catch {
      setSubmitState({
        kind: "error",
        message:
          "We could not send your sample request right now. Please call or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[130]">
          <motion.button
            type="button"
            aria-label="Close sample request overlay"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          <motion.aside
            id="sample-cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Sample request"
            className="absolute right-0 top-0 h-full w-[min(94vw,420px)] bg-[#F8F5F1] border-l border-gray-200 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-gray-700" />
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] text-gray-500">Sample Request</p>
                  <p className="text-sm text-gray-900">{headerSummary}</p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close sample request"
                className="p-2 border border-gray-300 text-gray-800 hover:border-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
              >
                <X size={16} />
              </button>
            </div>

            {storageMode === "memory" && (
              <div className="mx-4 sm:mx-6 mt-4 p-3 border border-amber-300 bg-amber-50 text-amber-900 text-xs leading-relaxed">
                Local storage is unavailable. Cart data is temporary for this session only.
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6">
              {submitState.kind === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <CheckCircle size={34} className="text-[#3B4034]" aria-hidden="true" />
                  <p className="font-serif text-2xl text-gray-900">Sample request sent</p>
                  <p className="text-sm text-gray-600 max-w-[20rem] leading-6">
                    {submitState.message}
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] border border-gray-300 px-5 py-3 hover:border-gray-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <p className="font-serif text-2xl text-gray-900">No samples selected</p>
                  <p className="text-sm text-gray-600 max-w-[18rem]">
                    Choose a finish from a product detail page, then request samples here.
                  </p>
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] border border-gray-300 px-5 py-3 hover:border-gray-900 transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="font-serif text-2xl text-gray-900">
                      Request selected samples
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Send these finishes to Aushen now. We will confirm availability,
                      pickup or delivery options, and any showroom follow-up.
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {lines.map((line) => (
                      <li
                        key={`${line.productSlug}-${line.finishId}`}
                        className="border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-serif text-lg text-gray-900">{line.productName}</p>
                            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mt-2">
                              Finish: {line.finishName}
                            </p>
                            <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mt-1">
                              Sample: {line.sampleSize}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSample(line.productSlug, line.finishId)}
                            className="p-2 border border-gray-300 text-gray-700 hover:border-gray-900 transition-colors"
                            aria-label={`Remove ${line.productName} ${line.finishName}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <form className="space-y-4 border border-[#1a1c18] bg-white p-4" onSubmit={handleSubmitSampleRequest}>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                        Contact details
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Product and finish details are included automatically.
                      </p>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                        First name
                      </span>
                      <input
                        type="text"
                        value={formState.firstName}
                        onChange={(event) => updateField("firstName")(event.target.value)}
                        required
                        autoComplete="given-name"
                        className="h-11 border border-[#D8D2C8] bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                        Email
                      </span>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => updateField("email")(event.target.value)}
                        required
                        autoComplete="email"
                        className="h-11 border border-[#D8D2C8] bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                        Phone
                      </span>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(event) => updateField("phone")(event.target.value)}
                        autoComplete="tel"
                        className="h-11 border border-[#D8D2C8] bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                        Project notes
                      </span>
                      <textarea
                        value={formState.notes}
                        onChange={(event) => updateField("notes")(event.target.value)}
                        rows={4}
                        placeholder="Suburb, delivery preference, timing, or quantity"
                        className="min-h-28 resize-y border border-[#D8D2C8] bg-white px-3 py-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      />
                    </label>

                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="sample-request-website">Website</label>
                      <input
                        id="sample-request-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formState.website}
                        onChange={(event) => updateField("website")(event.target.value)}
                      />
                    </div>

                    {submitState.kind === "error" && (
                      <p role="alert" className="text-sm leading-6 text-red-700">
                        {submitState.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-12 w-full items-center justify-between bg-[#1a1c18] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#F8F5F1] transition-colors hover:bg-[#3B4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending" : "Request Samples"}
                      {isSubmitting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={15} />
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {submitState.kind !== "success" && (
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={clearSamples}
                  disabled={lines.length === 0}
                  className="w-full border border-gray-300 py-3 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-900 transition-colors"
                >
                  Clear Samples
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
