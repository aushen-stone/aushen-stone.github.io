"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  isContactEndpointConfigured,
  pushContactConversionEvent,
  submitContactEnquiry,
} from "@/lib/contactSubmission";

type QuickEnquiryFormState = {
  firstName: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

type QuickEnquiryErrorState = { kind: "idle" } | { kind: "error"; message: string };

const EMPTY_FORM_STATE: QuickEnquiryFormState = {
  firstName: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

const INPUT_CLASS =
  "h-11 border border-[#D8D2C8] bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type QuickEnquiryFormProps = {
  /** Sent to the contact endpoint and GTM as the enquiry source. */
  source: string;
  userType: string;
  /** Wraps the customer's notes with page context before sending. */
  buildMessage: (customerNotes: string) => string;
  submitLabel: string;
  notesPlaceholder: string;
  /** Unique per page so the honeypot label/input ids never collide. */
  idPrefix: string;
};

export function QuickEnquiryForm({
  source,
  userType,
  buildMessage,
  submitLabel,
  notesPlaceholder,
  idPrefix,
}: QuickEnquiryFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<QuickEnquiryFormState>(EMPTY_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<QuickEnquiryErrorState>({ kind: "idle" });

  const updateField =
    (field: keyof QuickEnquiryFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { value } = event.target;
      setFormState((previous) => ({ ...previous, [field]: value }));
      if (errorState.kind !== "idle") {
        setErrorState({ kind: "idle" });
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isContactEndpointConfigured()) {
      setErrorState({
        kind: "error",
        message: "Contact endpoint is not configured. Please call or email Aushen directly.",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorState({ kind: "idle" });

    try {
      await submitContactEnquiry({
        firstName: formState.firstName,
        email: formState.email,
        phone: formState.phone,
        message: buildMessage(formState.message),
        userType,
        source,
        website: formState.website,
      });

      pushContactConversionEvent(source);
      router.push("/thank-you/");
    } catch {
      setErrorState({
        kind: "error",
        message: "We could not send your enquiry right now. Please call or email us directly.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">First name</span>
          <input
            type="text"
            value={formState.firstName}
            onChange={updateField("firstName")}
            required
            autoComplete="given-name"
            className={INPUT_CLASS}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Email</span>
          <input
            type="email"
            value={formState.email}
            onChange={updateField("email")}
            required
            autoComplete="email"
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Phone</span>
        <input
          type="tel"
          value={formState.phone}
          onChange={updateField("phone")}
          autoComplete="tel"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.14em] text-gray-500">Project notes</span>
        <textarea
          value={formState.message}
          onChange={updateField("message")}
          rows={4}
          placeholder={notesPlaceholder}
          className="min-h-28 resize-y border border-[#D8D2C8] bg-white px-3 py-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        />
      </label>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input
          id={`${idPrefix}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formState.website}
          onChange={updateField("website")}
        />
      </div>

      {errorState.kind === "error" && (
        <p role="alert" className="text-sm leading-6 text-red-700">
          {errorState.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full items-center justify-between bg-[#1a1c18] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#F8F5F1] transition-colors hover:bg-[#3B4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending" : submitLabel}
        {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
      </button>
    </form>
  );
}
