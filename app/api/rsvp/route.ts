import { templateContent } from "@/data/template-content";
import {
  appendSheetRow,
  readSheetsConfig,
  SheetsConfigurationError,
} from "@/lib/google-sheets";

/**
 * Receives the RSVP form and appends the answer to the Google Sheet.
 *
 * The browser only ever sees `{ success, message }`; the service-account key
 * stays in the server environment. Responses mirror what `lib/rsvp.ts`
 * expects: 503 when the sheet is not configured, 400 for an invalid answer,
 * 502 when Google rejects the write.
 */

const MAX_BODY_LENGTH = 2_000;
const MAX_NAME_LENGTH = 120;
const MIN_GUESTS = templateContent.rsvpGuests.min;
const MAX_GUESTS = templateContent.rsvpGuests.max;

const ATTENDANCE_LABELS = { yes: "Придёт", no: "Не придёт" } as const;
const LANGUAGE_LABELS = { ky: "Кыргызча", ru: "Русский" } as const;

const timestampFormat = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Bishkek",
  dateStyle: "short",
  timeStyle: "short",
});

export async function POST(request: Request) {
  if (!readSheetsConfig()) {
    console.error("RSVP: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is missing.");
    return reply(503, "RSVP storage is not configured.");
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_LENGTH) return reply(413, "Request is too large.");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return reply(400, "Invalid JSON.");
  }

  // Hidden field a person never fills in. Bots that do are told it worked.
  if (typeof body.website === "string" && body.website.trim()) {
    return reply(200);
  }

  const guestName = cleanName(body.guestName);
  if (!guestName) return reply(400, "Guest name is required.");

  const attendance = body.attendance;
  if (attendance !== "yes" && attendance !== "no") {
    return reply(400, "Attendance must be yes or no.");
  }

  let guestCount = 0;
  if (attendance === "yes") {
    guestCount = Number(body.guestCount);
    if (
      !Number.isInteger(guestCount) ||
      guestCount < MIN_GUESTS ||
      guestCount > MAX_GUESTS
    ) {
      return reply(400, `Guest count must be between ${MIN_GUESTS} and ${MAX_GUESTS}.`);
    }
  }

  const language = body.language === "ru" ? "ru" : "ky";

  try {
    await appendSheetRow([
      timestampFormat.format(new Date()),
      guestName,
      ATTENDANCE_LABELS[attendance],
      guestCount,
      LANGUAGE_LABELS[language],
    ]);
  } catch (error) {
    console.error("RSVP: could not write to Google Sheets.", error);
    if (error instanceof SheetsConfigurationError) {
      return reply(503, "RSVP storage is not configured.");
    }
    return reply(502, "Unable to save the answer.");
  }

  return reply(200);
}

/**
 * Collapses whitespace, drops control characters, and strips the leading
 * characters a spreadsheet would read as the start of a formula should the
 * sheet ever be exported to CSV.
 */
function cleanName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[=+\-@]+/, "")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

function reply(status: number, message?: string) {
  return Response.json(
    message ? { success: status === 200, message } : { success: status === 200 },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
