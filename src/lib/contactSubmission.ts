export const CONTACT_CONVERSION_EVENT = "contact_form_submit";

const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ?? "";

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export type ContactSubmissionInput = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  message: string;
  userType: string;
  source: string;
  website?: string;
};

export function isContactEndpointConfigured(): boolean {
  return CONTACT_API_URL.length > 0;
}

export function pushContactConversionEvent(source: string): void {
  if (typeof window === "undefined") return;

  const conversionWindow = window as DataLayerWindow;
  conversionWindow.dataLayer = conversionWindow.dataLayer || [];
  conversionWindow.dataLayer.push({
    event: CONTACT_CONVERSION_EVENT,
    form_source: source,
  });
}

export async function submitContactEnquiry(
  input: ContactSubmissionInput
): Promise<void> {
  if (!CONTACT_API_URL) {
    throw new Error("contact_endpoint_missing");
  }

  const response = await fetch(CONTACT_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      firstName: input.firstName.trim(),
      lastName: input.lastName?.trim() ?? "",
      email: input.email.trim(),
      phone: input.phone?.trim() ?? "",
      message: input.message.trim(),
      userType: input.userType,
      source: input.source,
      website: input.website?.trim() ?? "",
    }),
  });

  let payload: { ok?: boolean; error?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    // Fall through to generic response validation.
  }

  if (!response.ok || payload?.ok !== true) {
    throw new Error(payload?.error || "submit_failed");
  }
}
