import type { Metadata, Viewport } from "next";
import { Forum, Great_Vibes, Lora } from "next/font/google";
import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { DEFAULT_LANGUAGE, t } from "@/data/translations";
import { longDate, parseEventDate } from "@/lib/date";
import "./globals.css";

/**
 * Great Vibes carries the script name, Forum the engraved capitals and Lora
 * the running text. All three are loaded with `cyrillic-ext`, the subset that
 * holds the Kyrgyz letters ө, ң and ү.
 */
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-great-vibes",
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
const description = `${eventName}: ${brideName}. ${eventDate}.`;

export const metadata: Metadata = {
  title: `${brideName} — ${eventName}`,
  description,
  applicationName: eventName,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    title: `${brideName} — ${eventName}`,
    description,
    locale: "ky_KG",
    alternateLocale: ["ru_RU"],
  },
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
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      className={`${greatVibes.variable} ${forum.variable} ${lora.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
