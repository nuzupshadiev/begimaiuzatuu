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
  slug: "garden-kyz-uzatuu",
  type: "kyz_uzatuu",
  people: {
    bride: {
      name: {
        ru: "Айсулуу",
        ky: "Айсулуу",
      },
      parents: {
        ru: "Бакыт и Гүлмира Асановы",
        ky: "Бакыт жана Гүлмира Асановдор",
      },
    },
  },
  event: {
    date: "2026-09-12",
    startTime: "17:00",
  },
  venue: {
    name: {
      ru: 'ресторан "Ак-Кеме"',
      ky: '"Ак-Кеме" рестораны',
    },
    address: {
      ru: "г. Бишкек, пр. Мира, 93",
      ky: "Бишкек шаары, Мир проспекти, 93",
    },
    mapUrl: "https://2gis.kg/bishkek",
  },
  weddingDetails: {
    customMessage: {
      ru: "Приглашаем Вас на проводы нашей любимой дочери и просим стать почётными гостями нашего торжественного праздничного дастархана!",
      ky: "Сиздерди сүйүктүү кызыбыздын узатуу тоюна арналган салтанаттуу ак дасторконубуздун кадырлуу коногу болууга чакырабыз!",
    },
    hosts: {
      ru: "Семья Асановых",
      ky: "Асановдор үй-бүлөсү",
    },
    dressCode: {
      ru: "Вы можете выбрать наряд, подходящий для вечернего торжества и удобный для вас. Строгих требований нет — главное, чувствуйте себя комфортно.",
      ky: "Кечки майрамга жарашыктуу, өзүңүзгө ыңгайлуу кийим тандасаңыз болот. Катуу талаптар жок — эң башкысы, өзүңүздү жайлуу сезиңиз.",
    },
  },
  /**
   * Absolute RSVP endpoint. Left empty in the template: the app falls back to
   * `${NEXT_PUBLIC_RSVP_API_URL}/api/rsvp`, and Invitation Admin writes the
   * generated absolute URL here at deployment time.
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
