/**
 * Design-only copy, schedule and asset paths for the "Garden" Kyz Uzatuu
 * template.
 *
 * Nothing here is customer data — Invitation Admin never rewrites this file.
 * Customer values (names, parents, date, venue, message, hosts, dress code)
 * live in `data/invitation.ts`.
 */
import type { LocalizedText } from "./translations";

export interface ScheduleItem {
  /** Minutes after `invitation.event.startTime`. */
  readonly offsetMinutes: number;
  readonly title: LocalizedText;
  readonly icon: ScheduleIcon;
}

export type ScheduleIcon = "gate" | "bloom" | "dove" | "dance" | "lantern";

export const templateContent = {
  eventName: {
    ru: "Кыз узату",
    ky: "Кыз узатуу",
  },

  intro: {
    eyebrow: { ru: "Приглашение", ky: "Чакыруу" },
    note: {
      ru: "для дорогих гостей",
      ky: "кадырлуу конокторго",
    },
  },

  hero: {
    eyebrow: { ru: "Кыз узату", ky: "Кыз узатуу" },
    note: {
      ru: "Мы приглашаем вас разделить с нами этот вечер",
      ky: "Сиздерди ушул кечти биз менен бөлүшүүгө чакырабыз",
    },
  },

  message: {
    heading: { ru: "Дорогие гости!", ky: "Урматтуу коноктор!" },
    /** Introduces the bride's name, which the medallion below it carries. */
    lead: {
      ru: "Приглашаем вас стать почётными гостями нашего торжества, посвящённого проводам нашей любимой дочери",
      ky: "Сиздерди сүйүктүү",
    },
    /** Punctuation that closes the bride's name; empty where none. */
    nameSuffix: { ru: "!", ky: "" },
    /** Signs the invitation off, immediately above the parents' names. */
    hostsLabel: { ru: "С уважением,", ky: "Урматтоо менен," },
  },

  date: {
    heading: { ru: "День торжества", ky: "Салтанат күнү" },
  },

  countdown: {
    heading: {
      ru: "До торжества осталось",
      ky: "Салтанатка чейин калды",
    },
  },

  schedule: {
    heading: { ru: "Программа вечера", ky: "Кеченин жүрүшү" },
    items: [
      {
        offsetMinutes: 0,
        icon: "gate",
        title: { ru: "Встреча гостей", ky: "Конокторду тосуп алуу" },
      },
      {
        offsetMinutes: 45,
        icon: "bloom",
        title: { ru: "Начало торжества", ky: "Салтанаттын башталышы" },
      },
      {
        offsetMinutes: 105,
        icon: "dove",
        title: { ru: "Благословение и поздравления", ky: "Ак бата жана куттуктоолор" },
      },
      {
        offsetMinutes: 165,
        icon: "dance",
        title: { ru: "Танец с родителями", ky: "Ата-эне менен бий" },
      },
      {
        offsetMinutes: 240,
        icon: "lantern",
        title: { ru: "Проводы невесты", ky: "Кызды узатуу" },
      },
    ] as readonly ScheduleItem[],
  },

  venue: {
    heading: { ru: "Место торжества", ky: "Салтанаттын өтүүчү жери" },
  },

  dressCode: {
    heading: { ru: "Дресс-код", ky: "Кийим үлгүсү" },
  },

  rsvp: {
    heading: { ru: "Подтверждение", ky: "Ырастоо" },
    note: {
      ru: "Пожалуйста, ответьте до дня торжества — так мы сможем встретить вас как дорогих гостей.",
      ky: "Сураныч, салтанат күнүнө чейин жооп бериңиз — ошондо сиздерди кадырлуу конок катары тосуп ала алабыз.",
    },
  },

  footer: {
    farewell: {
      ru: "С нетерпением ждём встречи с вами!",
      ky: "Сиздерди чыдамсыздык менен күтөбүз!",
    },
  },

  /** Guest-count bounds accepted by the central RSVP API. */
  rsvpGuests: {
    min: 1,
    max: 20,
  },
} as const;

/** Deployed asset paths. Every entry below exists under `public/`. */
export const templateAssets = {
  garden: {
    src: "/assets/images/garden-gazebo.webp",
    width: 1200,
    height: 1488,
  },
  envelope: {
    src: "/assets/images/feather-envelope.webp",
    width: 799,
    height: 718,
  },
  blossomBranch: {
    src: "/assets/images/blossom-branch.webp",
    width: 640,
    height: 615,
  },
  blossomCluster: {
    src: "/assets/images/blossom-cluster.webp",
    width: 520,
    height: 520,
  },
  dove: {
    src: "/assets/images/dove.webp",
    width: 413,
    height: 620,
  },
  ornamentLight: {
    src: "/assets/images/ornament-frame-light.webp",
    width: 900,
    height: 637,
  },
  ornamentOlive: {
    src: "/assets/images/ornament-frame-olive.webp",
    width: 565,
    height: 800,
  },
  venueSketch: {
    src: "/assets/images/venue-sketch.webp",
    width: 800,
    height: 372,
  },
  lace: {
    src: "/assets/textures/lace-oval.webp",
    width: 700,
    height: 466,
  },
} as const;
