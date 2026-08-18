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
      ru: "Мы приглашаем вас в наш цветущий сад",
      ky: "Сиздерди гүлдөгөн бакчабызга чакырабыз",
    },
  },

  message: {
    heading: { ru: "Дорогие гости!", ky: "Урматтуу коноктор!" },
  },

  bride: {
    heading: { ru: "Наша дочь", ky: "Кызыбыз" },
    parentsLabel: { ru: "Родители невесты", ky: "Кыздын ата-энеси" },
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
    heading: { ru: "Программа вечера", ky: "Кечтин программасы" },
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
    note: {
      ru: "Будем благодарны, если вы поддержите палитру нашего сада",
      ky: "Бакчабыздын түстөрүн колдосоңуздар, ыраазы болобуз",
    },
    /** Swatches drawn from the template palette, not from customer data. */
    palette: [
      { ru: "Шалфей", ky: "Шалфей", color: "#8f9d80" },
      { ru: "Пудра", ky: "Пудра", color: "#e2bcc0" },
      { ru: "Слоновая кость", ky: "Пил сөөгү", color: "#f2ece1" },
      { ru: "Олива", ky: "Зайтун", color: "#5f6b4f" },
    ],
  },

  gallery: {
    heading: { ru: "Наш сад", ky: "Биздин бакча" },
    quote: {
      ru: "Пусть этот вечер расцветёт в памяти каждого, кто будет рядом",
      ky: "Бул кече жанында болгон ар бир адамдын эсинде гүлдөп калсын",
    },
  },

  rsvp: {
    heading: { ru: "Подтверждение", ky: "Ырастоо" },
    note: {
      ru: "Пожалуйста, ответьте до дня торжества — так мы сможем встретить вас как дорогих гостей.",
      ky: "Сураныч, салтанат күнүнө чейин жооп бериңиз — ошондо сиздерди кадырлуу конок катары тосуп ала алабыз.",
    },
  },

  hosts: {
    heading: { ru: "С уважением", ky: "Урматтоо менен" },
  },

  footer: {
    farewell: {
      ru: "Ждём вас в нашем саду",
      ky: "Сиздерди бакчабызда күтөбүз",
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
    src: "/assets/images/garden-gazebo.jpg",
    width: 1200,
    height: 1488,
  },
  envelope: {
    src: "/assets/images/feather-envelope.png",
    width: 799,
    height: 718,
  },
  waxSeal: {
    src: "/assets/images/wax-seal.png",
    width: 520,
    height: 520,
  },
  blossomBranch: {
    src: "/assets/images/blossom-branch.png",
    width: 640,
    height: 615,
  },
  blossomCluster: {
    src: "/assets/images/blossom-cluster.png",
    width: 520,
    height: 520,
  },
  dove: {
    src: "/assets/images/dove.png",
    width: 413,
    height: 620,
  },
  ornamentLight: {
    src: "/assets/images/ornament-frame-light.png",
    width: 900,
    height: 637,
  },
  ornamentOlive: {
    src: "/assets/images/ornament-frame-olive.png",
    width: 565,
    height: 800,
  },
  venueSketch: {
    src: "/assets/images/venue-sketch.png",
    width: 800,
    height: 372,
  },
  lace: {
    src: "/assets/textures/lace-oval.png",
    width: 700,
    height: 466,
  },
} as const;

export interface GalleryImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: LocalizedText;
}

/**
 * The decorative gallery. Drop further garden photographs in here (or empty
 * the array) — `GallerySection` renders nothing when there is no image.
 */
export const galleryImages: readonly GalleryImage[] = [
  {
    ...templateAssets.garden,
    alt: {
      ru: "Беседка в цветущем саду",
      ky: "Гүлдөгөн бакчадагы беседка",
    },
  },
];
