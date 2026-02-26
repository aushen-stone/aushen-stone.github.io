"use client";

import { FormEvent, useState } from "react";
import { Footer } from "@/app/components/Footer";
import { MapPin, Phone, Clock, ArrowRight, Check } from "lucide-react";
import { SAMPLE_CART_CONTACT_HANDOFF_KEY } from "@/types/cart";
import { CONTACT_INFO } from "@/data/contact";

type UserType = "homeowner" | "pro";

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  source: string;
};

type SubmitState =
  | { kind: "idle"; message: "" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ?? "";

function getInitialMessageAndSource() {
  if (typeof window === "undefined") {
    return { message: "", source: "website-contact" };
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("source") !== "sample-cart") {
    return { message: "", source: "website-contact" };
  }

  try {
    const prefillMessage = window.sessionStorage.getItem(
      SAMPLE_CART_CONTACT_HANDOFF_KEY
    );
    if (prefillMessage) {
      window.sessionStorage.removeItem(SAMPLE_CART_CONTACT_HANDOFF_KEY);
      return { message: prefillMessage, source: "sample-cart" };
    }
  } catch {
    // Ignore sessionStorage failures and keep default message state.
  }

  return { message: "", source: "sample-cart" };
}

// === 组件: 身份切换器 (The Identity Toggle) ===
function IdentityToggle({
  active,
  onChange,
}: {
  active: UserType;
  onChange: (val: UserType) => void;
}) {
  return (
    <div className="flex flex-col gap-4 mb-12">
      <span className="text-xs uppercase tracking-widest text-gray-500">I am a...</span>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => onChange("homeowner")}
          className={`group w-full sm:w-auto flex items-center gap-3 text-base sm:text-lg md:text-2xl font-serif transition-colors ${
            active === "homeowner"
              ? "text-[#1a1c18]"
              : "text-gray-300 hover:text-gray-500"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              active === "homeowner"
                ? "border-[#1a1c18] bg-[#1a1c18] text-white"
                : "border-gray-300"
            }`}
          >
            {active === "homeowner" && <Check size={14} />}
          </span>
          Homeowner
        </button>

        <button
          type="button"
          onClick={() => onChange("pro")}
          className={`group w-full sm:w-auto flex items-center gap-3 text-base sm:text-lg md:text-2xl font-serif transition-colors ${
            active === "pro" ? "text-[#1a1c18]" : "text-gray-300 hover:text-gray-500"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              active === "pro" ? "border-[#1a1c18] bg-[#1a1c18] text-white" : "border-gray-300"
            }`}
          >
            {active === "pro" && <Check size={14} />}
          </span>
          Architect / Builder
        </button>
      </div>
    </div>
  );
}

// === 组件: 极简输入框 (Underline Input) ===
function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;

  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-[#1a1c18] transition-colors"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-transparent border-b border-gray-200 py-4 text-lg text-[#1a1c18] placeholder:text-gray-200 focus:outline-none focus:border-[#1a1c18] transition-colors font-serif"
      />
    </div>
  );
}

export default function ContactPage() {
  const [userType, setUserType] = useState<UserType>("homeowner");
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>(() => {
    const { message, source } = getInitialMessageAndSource();
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message,
      website: "",
      source,
    };
  });

  const updateField =
    (field: keyof ContactFormState) =>
    (value: string): void => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (submitState.kind !== "idle") {
        setSubmitState({ kind: "idle", message: "" });
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!CONTACT_API_URL) {
      setSubmitState({
        kind: "error",
        message:
          "Contact endpoint is not configured. Set NEXT_PUBLIC_CONTACT_API_URL before deployment.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ kind: "idle", message: "" });

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          firstName: formState.firstName.trim(),
          lastName: formState.lastName.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim(),
          message: formState.message.trim(),
          userType,
          source: formState.source,
          website: formState.website.trim(),
        }),
      });

      let payload: { ok?: boolean; error?: string } | null = null;
      try {
        payload = await response.json();
      } catch {
        // Ignore JSON parse failures and fallback to generic error handling.
      }

      if (!response.ok || payload?.ok !== true) {
        throw new Error(payload?.error || "submit_failed");
      }

      setSubmitState({
        kind: "success",
        message:
          "Thanks, your message has been sent. Our team will contact you shortly.",
      });

      setFormState((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        website: "",
      }));
    } catch {
      setSubmitState({
        kind: "error",
        message:
          "We could not send your message right now. Please call or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#F8F5F1] min-h-screen selection:bg-[#1a1c18] selection:text-white">
      {/* Global Noise Overlay (Consistent with Story Page) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-[1600px] mx-auto page-padding-x pt-32 sm:pt-36 md:pt-40 pb-20 sm:pb-24 relative z-10">
        
        {/* Header Title */}
        <div className="mb-16 sm:mb-20 md:mb-32">
           <h1 className="font-serif text-[clamp(2.2rem,8vw,6rem)] text-[#1a1c18] leading-[0.9]">
             Start the <br/> <span className="italic text-gray-400">Conversation.</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* === LEFT COLUMN: The Invitation (Info) === */}
          <div className="lg:col-span-4 lg:sticky lg:top-[var(--content-sticky-top)]">
             
             {/* Info Block */}
             <div className="space-y-12">
                <div>
                   <div className="flex items-center gap-3 text-[#1a1c18] mb-4">
                      <MapPin size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Showroom</span>
                   </div>
                   <div className="flex flex-col items-start gap-5">
                     <a
                       href={CONTACT_INFO.mapDirectionsUrl}
                       target="_blank"
                       rel="noreferrer"
                       aria-label={`Open directions to ${CONTACT_INFO.addressLabel}`}
                       className="inline-block font-serif text-xl text-gray-800 leading-relaxed hover:text-[#1a1c18] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                     >
                       {CONTACT_INFO.addressLine1}<br/>
                       {CONTACT_INFO.addressLine2}
                     </a>
                     <a
                       href={CONTACT_INFO.mapDirectionsUrl}
                       target="_blank"
                       rel="noreferrer"
                       aria-label={`Get directions to ${CONTACT_INFO.addressLabel}`}
                       className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-gray-500 hover:text-[#1a1c18] hover:border-[#1a1c18] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                     >
                        Get Directions
                     </a>
                   </div>
                </div>

                <div>
                   <div className="flex items-center gap-3 text-[#1a1c18] mb-4">
                      <Clock size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Open Hours</span>
                   </div>
                   <p className="text-sm text-gray-600 leading-loose">
                     Mon - Fri: 8:30am - 4:30pm<br/>
                     Sat: 10:00am - 3:00pm<br/>
                     Sun: Closed
                   </p>
                </div>

                <div>
                   <div className="flex items-center gap-3 text-[#1a1c18] mb-4">
                      <Phone size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Contact</span>
                   </div>
                   <p className="text-sm text-gray-600 leading-loose">
                     <a
                       href={CONTACT_INFO.phoneLink}
                       className="hover:text-[#1a1c18] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                       aria-label={`Call ${CONTACT_INFO.phoneDisplay}`}
                     >
                       {CONTACT_INFO.phoneDisplay}
                     </a>
                     <br/>
                     <a
                       href={`mailto:${CONTACT_INFO.email}`}
                       className="hover:text-[#1a1c18] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
                       aria-label={`Email ${CONTACT_INFO.email}`}
                     >
                       {CONTACT_INFO.email}
                     </a>
                   </p>
                </div>
             </div>

             {/* The "Map" Visual (Stylized Abstract Block) */}
             <a
               href={CONTACT_INFO.mapDirectionsUrl}
               target="_blank"
               rel="noreferrer"
               aria-label={`Open map directions to ${CONTACT_INFO.addressLabel}`}
               className="mt-16 block w-full aspect-square bg-gray-200 grayscale opacity-80 overflow-hidden relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1c18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F1]"
             >
                {/* Placeholder Map Image */}
                <img 
                  src="/task-a-2026-02-24/contact-map-aerial.webp" 
                  alt="Map Location" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-[#1a1c18]/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute center inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ArrowRight size={20} className="text-[#1a1c18] group-hover:-rotate-45 transition-transform duration-300" />
                   </div>
                </div>
             </a>
          </div>

          {/* === RIGHT COLUMN: The Letter (Form) === */}
          <div className="lg:col-span-8 bg-white p-8 md:p-16 shadow-sm border border-gray-100">
             
             {/* 1. Identity Selector */}
             <IdentityToggle active={userType} onChange={setUserType} />

             {/* 2. The Form Fields */}
             <form className="space-y-8 sm:space-y-12 mt-10 sm:mt-12" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                   <InputField
                     label="First Name"
                     name="first-name"
                     placeholder="John"
                     value={formState.firstName}
                     onChange={updateField("firstName")}
                     autoComplete="given-name"
                     required
                   />
                   <InputField
                     label="Last Name"
                     name="last-name"
                     placeholder="Doe"
                     value={formState.lastName}
                     onChange={updateField("lastName")}
                     autoComplete="family-name"
                   />
                </div>
                
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formState.email}
                  onChange={updateField("email")}
                  autoComplete="email"
                  required
                />
                
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="0400 000 000"
                  value={formState.phone}
                  onChange={updateField("phone")}
                  autoComplete="tel"
                />

                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    value={formState.website}
                    onChange={(event) => updateField("website")(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Conditional Field based on user type */}
                <div className="group relative">
                   <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                     {userType === "homeowner"
                       ? "Tell us about your dream project"
                       : "Project Scope / Estimated Volume"}
                   </label>
                   <textarea 
                     rows={4}
                     required
                     className="w-full bg-transparent border-b border-gray-200 py-4 text-lg text-[#1a1c18] placeholder:text-gray-200 focus:outline-none focus:border-[#1a1c18] transition-colors font-serif resize-none"
                     value={formState.message}
                     onChange={(event) => updateField("message")(event.target.value)}
                     placeholder={
                       userType === "homeowner"
                         ? "I'm looking for bluestone pavers for my new pool area..."
                         : "Commercial project in CBD, approx 500m2..."
                     }
                   ></textarea>
                </div>

                {submitState.kind !== "idle" && (
                  <p
                    className={`text-sm ${
                      submitState.kind === "success" ? "text-green-700" : "text-red-700"
                    }`}
                    role={submitState.kind === "error" ? "alert" : "status"}
                  >
                    {submitState.message}
                  </p>
                )}

                {/* 3. Submit Button */}
                <div className="pt-4 sm:pt-8 flex justify-stretch sm:justify-end">
                   <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto justify-center sm:justify-start bg-[#1a1c18] text-white px-[var(--btn-px)] py-[var(--btn-py)] uppercase tracking-[0.16em] sm:tracking-[0.25em] text-[11px] sm:text-xs hover:bg-[#3B4034] transition-colors shadow-xl shadow-gray-900/10 flex items-center gap-4 group disabled:opacity-60 disabled:cursor-not-allowed"
                   >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                   </button>
                </div>
             </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
