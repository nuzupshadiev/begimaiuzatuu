# Garden — Kyz Uzatuu invitation template

A single-page Kyz Uzatuu (кыз узатуу) invitation built with the Next.js App
Router. A feathered envelope opens the page, a garden gazebo photograph is the
hero backdrop, and watercolour blossoms, a lace medallion, engraved botanical
frames and a wax seal carry the sections below it. The photograph is scenery
only — no copy promises the guest a garden venue, so the template suits any
restaurant or hall.

Sections: intro → hero → invitation message → bride →
date and month calendar → countdown → programme → venue and map → optional
dress code → RSVP → hosts → footer.

Kyrgyz opens first; Russian is one tap away in the switcher. Every visible
label exists in both languages.

## Local development

```bash
pnpm install
cp .env.example .env.local   # Google Sheets credentials for the RSVP form
pnpm dev
```

Open http://localhost:3000.

## Checks and production build

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Invitation data contract

`data/invitation.ts` exports a single plain object literal named `invitation`.
Invitation Admin rewrites that object when it generates a customer invitation,
so the file must keep its shape:

```ts
export const invitation = {
  slug: "garden-kyz-uzatuu",
  type: "kyz_uzatuu",
  people: { bride: { name: { ru, ky } } },
  event: { date: "YYYY-MM-DD", startTime: "HH:mm" },
  venue: { name: { ru, ky }, address: { ru, ky }, mapUrl },
  weddingDetails: { customMessage: { ru, ky }, hosts: { ru, ky }, dressCode: { ru, ky } },
  rsvp: { endpoint: "" },
  media: { music: "/assets/audio/background-music.mp3" },
} as const;
```

Rules:

- Never rename `invitation`, and keep it a direct object literal — no JSON, no
  API, no database.
- This is a Kyz Uzatuu template: there is no `people.groom`, and none is
  required.
- An empty localized string means "not provided". The matching block is not
  rendered at all, so leaving `dressCode` blank removes those
  sections instead of leaving an empty card behind.
- Design-only copy — section headings, the evening's programme, asset paths —
  belongs in `data/template-content.ts`, and reusable interface strings in
  `data/translations.ts`. Nothing there is customer data.
- Dates are parsed field by field in `lib/date.ts` and the countdown is
  anchored to Bishkek (UTC+6), so a guest in another timezone never sees the
  previous day.

## RSVP integration

The form posts to this deployment's own route, `app/api/rsvp/route.ts`, which
validates the answer and appends a row to a Google Sheet as a service account:

```
POST /api/rsvp
{ guestName, attendance: "yes" | "no", guestCount, language }
→ Дата и время | Имя гостя | Ответ | Количество гостей | Язык
```

The header row is written automatically the first time the tab is empty.
Values are stored as plain text (`RAW`), so nothing a guest types is run as a
formula, and a hidden honeypot field turns away simple bots.

Setup:

1. In Google Cloud, enable the **Google Sheets API**, create a service account
   and download a JSON key for it.
2. Share the spreadsheet with the service account's email as an **Editor**.
3. Set the variables from `.env.example` in `.env.local` locally and under
   Project → Settings → Environment Variables on Vercel, then redeploy:
   `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, and
   optionally `GOOGLE_SHEET_TAB`.

The credentials are read only on the server (`lib/google-sheets.ts`) and never
reach the browser; none of them carry the `NEXT_PUBLIC_` prefix. `.env*` files
are git-ignored — only `.env.example` is committed. While the variables are
missing the route answers 503 and the form shows a localized "not configured
yet" message instead of pretending to succeed.

An absolute URL in `invitation.rsvp.endpoint` overrides the route and sends
answers to that service instead.

## Link preview

WhatsApp, Telegram and other messengers read the Open Graph tags set in
`app/layout.tsx`: the title and description are built from
`data/invitation.ts`, and the picture is `app/opengraph-image.jpg` — a
1200×630 JPEG kept under 200 KB so WhatsApp shows it. It carries the bride's
name and date as text, so replace it whenever those change. On Vercel the
image URL is made absolute from the production domain automatically; a local
build warns that it falls back to `localhost`, which is expected. WhatsApp
caches previews, so a link shared before a change may keep the old card.

## Assets

Deployed files live under `public/assets/` and every one of them is used:

```
public/assets/
  images/
    garden-gazebo.webp        hero + intro background
    feather-envelope.webp     intro screen
    ornament-frame-olive.webp intro card border
    ornament-frame-light.webp hero overlay (white line art)
    dove.webp                 hero decoration
    blossom-branch.webp       message section
    blossom-cluster.webp      message section
    venue-sketch.webp         venue section
    wax-seal.webp             hosts section
  textures/
    lace-oval.webp            bride medallion
  audio/                     empty; see below
```

The original design material stays in `/assets` at the repository root and is
git-ignored — only converted, web-named copies are published.

### Replacing assets safely

1. Drop the new file into the matching `public/assets/**` folder using a
   lowercase kebab-case name.
2. Update its entry in `templateAssets` in `data/template-content.ts`,
   including `width` and `height` — those numbers feed `next/image` and keep
   the layout from shifting.
3. Keep transparency (WebP/PNG) for the decorative overlays; `next/image`
   re-encodes for delivery on its own.
4. Run `pnpm build` afterwards: a missing file fails the build rather than
   the deployment.

### Background music

No audio ships with this template. Drop an `.mp3` at
`public/assets/audio/background-music.mp3` (or let Invitation Admin write its
library track over that path) and the play/pause control appears next to the
language switcher. While no file exists the control stays hidden — the page
probes the path once and never downloads anything it cannot use. Playback only
ever starts from a user gesture, beginning with the "open invitation" button.

## Accessibility and motion

Semantic headings, labelled form fields, `aria-live` RSVP feedback, a skip
link, visible focus rings, and decorative imagery hidden from assistive
technology. Local script fonts are self-hosted through `next/font/local` in
`app/fonts/`. `prefers-reduced-motion` removes the reveal, float and drift
animations; the invitation is fully usable without JavaScript-driven motion,
audio, or images.
