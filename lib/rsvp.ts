/**
 * RSVP submission against the central RSVP API.
 *
 * This template never stores answers itself and ships no `app/api/rsvp` route:
 * the browser posts straight to the shared service. The endpoint comes from
 * `invitation.rsvp.endpoint` when Invitation Admin has written the generated
 * absolute URL into it, otherwise from `NEXT_PUBLIC_RSVP_API_URL`.
 */
import { invitation } from "@/data/invitation";
import type { Language } from "@/data/translations";

export type Attendance = "yes" | "no";

export interface RsvpPayload {
  guestName: string;
  attendance: Attendance;
  guestCount: number;
  language: Language;
}

export class RsvpConfigurationError extends Error {}
export class RsvpRequestError extends Error {}

/** Resolves the absolute RSVP endpoint, or null when nothing is configured. */
export function resolveRsvpEndpoint(): string | null {
  const generated = invitation.rsvp.endpoint.trim();
  if (isAbsoluteHttpUrl(generated)) return generated;

  const base = process.env.NEXT_PUBLIC_RSVP_API_URL?.trim().replace(/\/$/, "");
  if (!base || !isAbsoluteHttpUrl(base)) return null;
  return `${base}/api/rsvp`;
}

export async function submitRsvp({
  guestName,
  attendance,
  guestCount,
  language,
}: RsvpPayload): Promise<void> {
  const endpoint = resolveRsvpEndpoint();
  if (!endpoint) {
    throw new RsvpConfigurationError("RSVP API is not configured.");
  }

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
      }),
    });
  } catch {
    // Offline, DNS failure, CORS rejection — nothing reached the service.
    throw new TypeError("Network request failed.");
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
