import type { Metadata, Viewport } from "next";
import { Forum, Lora } from "next/font/google";
import localFont from "next/font/local";
import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { DEFAULT_LANGUAGE, t } from "@/data/translations";
import { longDate, parseEventDate } from "@/lib/date";
import "./globals.css";

/**
 * Asylbek Shelley carries the script lines and PF Champion Script the hero
 * name, Forum the engraved capitals and Lora the running text. The two scripts
 * are self-hosted and subset to Latin + Cyrillic; the Google faces are loaded
 * with `cyrillic-ext`, the subset that holds the Kyrgyz letters ө, ң and ү.
 */
const asylbekShelley = localFont({
  src: "./fonts/asylbek-shelley.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-asylbek-shelley",
  fallback: ["Segoe Script", "cursive"],
  adjustFontFallback: false,
});

/** PF Champion Script — the copperplate roundhand of the hero name. */
const championScript = localFont({
  src: "./fonts/champion-script.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-champion-script",
  fallback: ["Segoe Script", "cursive"],
  adjustFontFallback: false,
});

const forum = Forum({
  weight: "400",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-forum",
});

const lora = Lora({
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-lora",
});

const brideName = t(invitation.people.bride.name, DEFAULT_LANGUAGE);
const eventName = t(templateContent.eventName, DEFAULT_LANGUAGE);
const eventDate = longDate(parseEventDate(invitation.event.date), DEFAULT_LANGUAGE);
const venueName = t(invitation.venue.name, DEFAULT_LANGUAGE);
const title = `${brideName} — ${eventName}`;
// The text WhatsApp and Telegram print under the link preview.
const description = [
  `${t(templateContent.preview.invite, DEFAULT_LANGUAGE)} ${eventDate}, ${invitation.event.startTime}`,
  venueName,
]
  .filter(Boolean)
  .join(" · ");

/**
 * The preview picture is `app/opengraph-image.jpg`, which Next.js links on its
 * own. On Vercel its absolute URL is built from the production domain, so no
 * `metadataBase` is needed.
 */
export const metadata: Metadata = {
  title,
  description,
  applicationName: eventName,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: eventName,
    locale: "ky_KG",
    alternateLocale: ["ru_RU"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  other: { google: "notranslate" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f3ec",
};

export default function RootLayout({
  children,
}: {
  // Typed explicitly rather than via Next's generated `LayoutProps` global, so
  // `npm run typecheck` works on a clean checkout before the first build.
  children: React.ReactNode;
}) {
  /**
   * Phones set to Russian auto-translate the Kyrgyz text into Russian, which
   * mangles it. `translate="no"` is the standard opt-out (Chrome, Safari, Edge),
   * the `notranslate` class is the one Google Translate itself looks for, and
   * the `google` meta tag in `metadata` stops Chrome offering to translate.
   */
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      translate="no"
      className={`notranslate ${asylbekShelley.variable} ${championScript.variable} ${forum.variable} ${lora.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
