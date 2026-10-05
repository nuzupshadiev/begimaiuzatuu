/**
 * RSVP submission.
 *
 * The form posts to this deployment's own `app/api/rsvp` route, which appends
 * the answer to the Google Sheet with credentials the browser never sees. An
 * absolute `invitation.rsvp.endpoint` (written by Invitation Admin) overrides
 * it and sends answers to that service instead.
 */
import { invitation } from "@/data/invitation";
import type { Language } from "@/data/translations";

export type Attendance = "yes" | "no";

export interface RsvpPayload {
  guestName: string;
  attendance: Attendance;
  guestCount: number;
  language: Language;
  /** Honeypot: hidden from people, so anything in it came from a bot. */
  website: string;
}

export class RsvpConfigurationError extends Error {}
export class RsvpRequestError extends Error {}

const LOCAL_ENDPOINT = "/api/rsvp";

export function resolveRsvpEndpoint(): string {
  const generated = invitation.rsvp.endpoint.trim();
  return isAbsoluteHttpUrl(generated) ? generated : LOCAL_ENDPOINT;
}

export async function submitRsvp({
  guestName,
  attendance,
  guestCount,
  language,
  website,
}: RsvpPayload): Promise<void> {
  const endpoint = resolveRsvpEndpoint();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationSlug: invitation.slug,
        guestName: guestName.trim(),
        attendance,
        guestCount: attendance === "no" ? 0 : guestCount,
        language,
        website,
      }),
    });
  } catch {
    // Offline, DNS failure, CORS rejection — nothing reached the service.
    throw new TypeError("Network request failed.");
  }

  // The route answers 503 while the Google Sheets variables are missing.
  if (response.status === 503) {
    throw new RsvpConfigurationError("RSVP storage is not configured.");
  }

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok || !isSuccess(result)) {
    throw new RsvpRequestError(readMessage(result) ?? "Unable to submit RSVP.");
  }
}

function isSuccess(result: unknown): boolean {
  return isRecord(result) && result.success === true;
}

function readMessage(result: unknown): string | null {
  if (isRecord(result) && typeof result.message === "string" && result.message.trim()) {
    return result.message;
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
