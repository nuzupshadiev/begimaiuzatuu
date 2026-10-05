/**
 * Appends RSVP rows to a Google Sheet as a service account.
 *
 * Server-only: it reads the service-account key from the environment and must
 * never be imported from a client component. The OAuth exchange is done by
 * hand with `node:crypto` (a signed JWT traded for an access token) so the
 * deployment carries no Google SDK.
 */
import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export const SHEET_HEADER = [
  "Дата и время",
  "Имя гостя",
  "Ответ",
  "Количество гостей",
  "Язык",
] as const;

const LAST_COLUMN = String.fromCharCode(64 + SHEET_HEADER.length);

interface SheetsConfig {
  clientEmail: string;
  privateKey: string;
  sheetId: string;
  /** Tab name; empty means the spreadsheet's first tab. */
  tab: string;
}

export class SheetsConfigurationError extends Error {}
export class SheetsRequestError extends Error {}

/** Reads the credentials, or null when any required variable is missing. */
export function readSheetsConfig(): SheetsConfig | null {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  if (!clientEmail || !privateKey || !sheetId) return null;
  return {
    clientEmail,
    privateKey,
    sheetId,
    tab: process.env.GOOGLE_SHEET_TAB?.trim() ?? "",
  };
}

/**
 * Accepts the key the way dashboards tend to store it: wrapped in quotes,
 * with literal `\n` sequences instead of line breaks, or with real ones.
 */
function normalizePrivateKey(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/^"([\s\S]*)"$/, "$1")
    .replace(/\\n/g, "\n");
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(config: SheetsConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) {
    return cachedToken.value;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = encodeSegment({ alg: "RS256", typ: "JWT" });
  const claims = encodeSegment({
    iss: config.clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  });

  let signature: string;
  try {
    signature = createSign("RSA-SHA256")
      .update(`${header}.${claims}`)
      .sign(config.privateKey)
      .toString("base64url");
  } catch {
    throw new SheetsConfigurationError("GOOGLE_PRIVATE_KEY is not a valid PEM key.");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  } | null;

  if (!response.ok || !result?.access_token) {
    throw new SheetsRequestError(
      `Google token exchange failed (${response.status}): ${result?.error_description ?? "no details"}`,
    );
  }

  cachedToken = {
    value: result.access_token,
    expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/** Set once this server instance has seen the header row in place. */
let headerReady = false;

/**
 * Appends one row under the header, writing the header first when the tab is
 * still empty so the family gets a readable sheet without setting it up.
 */
export async function appendSheetRow(row: readonly (string | number)[]) {
  const config = readSheetsConfig();
  if (!config) {
    throw new SheetsConfigurationError("Google Sheets credentials are not configured.");
  }

  const token = await getAccessToken(config);
  const prefix = config.tab ? `'${config.tab.replace(/'/g, "''")}'!` : "";
  const base = `${SHEETS_API}/${encodeURIComponent(config.sheetId)}/values`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  if (!headerReady) {
    const headerRange = encodeURIComponent(`${prefix}A1:${LAST_COLUMN}1`);
    const current = await sheetsFetch(`${base}/${headerRange}`, {
      headers,
    });
    const values = (current as { values?: unknown[][] }).values;
    if (!values?.[0]?.length) {
      await sheetsFetch(`${base}/${headerRange}?valueInputOption=RAW`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ values: [SHEET_HEADER] }),
      });
    }
    headerReady = true;
  }

  // RAW keeps a guest's text as text: nothing they type is parsed as a formula.
  const range = encodeURIComponent(`${prefix}A:${LAST_COLUMN}`);
  await sheetsFetch(
    `${base}/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ values: [row] }),
    },
  );
}

async function sheetsFetch(url: string, init: RequestInit): Promise<unknown> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    // A rejected token is dropped so the next request signs a fresh one.
    if (response.status === 401) cachedToken = null;
    const message =
      (result as { error?: { message?: string } } | null)?.error?.message ??
      "no details";
    throw new SheetsRequestError(
      `Google Sheets request failed (${response.status}): ${message}`,
    );
  }
  return result;
}

function encodeSegment(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}
