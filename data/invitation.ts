/**
 * Customer-specific invitation data.
 *
 * Invitation Admin replaces this whole object when it generates a customer
 * invitation, so it must stay a plain exported object literal named
 * `invitation`. Design-only copy (labels, schedule, decorations, asset paths)
 * belongs in `data/template-content.ts`, never here.
 *
 * Empty localized strings mean "not provided": the matching section is skipped
 * instead of rendering an empty card. The keys stay in place so the admin has
 * somewhere to write.
 */
export const invitation = {
  slug: "begimai-kyz-uzatuu",
  type: "kyz_uzatuu",
  people: {
    bride: {
      name: {
        ru: "Бегимай",
        ky: "Бегимай",
      },
    },
  },
  event: {
    date: "2026-10-14",
    startTime: "17:00",
  },
  venue: {
    name: {
      ru: "ресторан Eldorado Grand",
      ky: "Eldorado Grand рестораны",
    },
    address: {
      ru: "г. Ош, ул. Бекмамата Осмонова, 101Б",
      ky: "Ош шаары, Бекмамат Осмонов көчөсү, 101Б",
    },
    mapUrl: "https://2gis.kg/osh/firm/70000001034423594",
  },
  weddingDetails: {
    customMessage: {
      ru: "Приглашаем вас стать почётными гостями нашего торжества, посвящённого проводам нашей любимой дочери {{bride}}!",
      ky: "Сиздерди сүйүктүү {{bride}} кызыбыздын узатуу тоюна арналган салтанаттуу ак дасторконубуздун кадырлуу коногу болууга чакырабыз!",
    },
    hosts: {
      ru: "Мурат, Нуржамал",
      ky: "Мурат, Нуржамал",
    },
    dressCode: {
      ru: "",
      ky: "",
    },
  },
  /**
   * Absolute RSVP endpoint. Left empty, answers go to this deployment's own
   * `/api/rsvp` route, which appends them to the Google Sheet named by
   * `GOOGLE_SHEET_ID`. An absolute URL here sends them to that service instead.
   */
  rsvp: {
    endpoint: "",
  },
  /**
   * Public path of the background track. No audio file ships with this
   * template; drop one at `public/assets/audio/background-music.m4a` (or let
   * Invitation Admin write its library track over this path) and the music
   * control appears on its own. While the file is missing the control stays
   * hidden and the invitation behaves exactly as it does now.
   */
  media: {
    music: "/assets/audio/background-music.m4a",
  },
} as const;

export type Invitation = typeof invitation;
