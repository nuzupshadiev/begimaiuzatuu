/**
 * Reusable interface translations. Every visible label lives here or in
 * `template-content.ts` — never inline in a component.
 */
export const LANGUAGES = ["ky", "ru"] as const;

export type Language = (typeof LANGUAGES)[number];

/** A Kyrgyz Kyz Uzatuu invitation, so Kyrgyz opens first; RU is one tap away. */
export const DEFAULT_LANGUAGE: Language = "ky";

export interface LocalizedText {
  readonly ru: string;
  readonly ky: string;
}

/** Reads a localized value. Widens literal types so callers always get string. */
export function t(value: LocalizedText, language: Language): string {
  return value[language];
}

/** True when a localized value carries real text in the active language. */
export function has(
  value: LocalizedText | undefined,
  language: Language,
): boolean {
  return Boolean(value && value[language].trim());
}

export const languageNames: Record<Language, string> = {
  ky: "КЫР",
  ru: "РУС",
};

export const translations = {
  languageLabel: { ru: "Язык приглашения", ky: "Чакыруунун тили" },
  languageOption: {
    ru: { ru: "Русский язык", ky: "Орус тили" },
    ky: { ru: "Кыргызский язык", ky: "Кыргыз тили" },
  },

  intro: {
    open: { ru: "Открыть приглашение", ky: "Чакырууну ачуу" },
    hint: {
      ru: "Нажмите на конверт",
      ky: "Конвертти басыңыз",
    },
  },

  music: {
    play: { ru: "Включить музыку", ky: "Музыканы ойнотуу" },
    pause: { ru: "Выключить музыку", ky: "Музыканы токтотуу" },
  },

  countdown: {
    days: {
      ru: ["день", "дня", "дней"],
      ky: ["күн", "күн", "күн"],
    },
    hours: {
      ru: ["час", "часа", "часов"],
      ky: ["саат", "саат", "саат"],
    },
    minutes: {
      ru: ["минута", "минуты", "минут"],
      ky: ["мүнөт", "мүнөт", "мүнөт"],
    },
    seconds: {
      ru: ["секунда", "секунды", "секунд"],
      ky: ["секунд", "секунд", "секунд"],
    },
    finished: {
      ru: "Торжество уже началось!",
      ky: "Салтанат башталды!",
    },
  },

  calendar: {
    weekdays: {
      ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      ky: ["Дү", "Ше", "Ша", "Бе", "Жу", "Иш", "Же"],
    },
    eventDay: { ru: "День торжества", ky: "Салтанат күнү" },
    startsAt: { ru: "Начало в", ky: "Башталышы" },
  },

  venue: {
    mapButton: { ru: "Открыть карту", ky: "Картаны ачуу" },
    mapHint: {
      ru: "Ссылка откроется в новой вкладке",
      ky: "Шилтеме жаңы өтмөктө ачылат",
    },
  },

  rsvp: {
    nameLabel: { ru: "Имя и фамилия", ky: "Аты-жөнүңүз" },
    namePlaceholder: { ru: "Ваше имя и фамилия", ky: "Аты-жөнүңүз" },
    attendanceLabel: { ru: "Сможете прийти?", ky: "Келе аласызбы?" },
    attendanceYes: { ru: "С радостью приду", ky: "Сөзсүз барам" },
    attendanceNo: { ru: "К сожалению, не смогу", ky: "Тилекке каршы, бара албайм" },
    guestCountLabel: { ru: "Количество гостей", ky: "Конокторуңуздун саны" },
    guestCountHint: {
      ru: "Включая вас — от 1 до 20 человек",
      ky: "Сизди кошкондо — 1ден 20 адамга чейин",
    },
    decrease: { ru: "Уменьшить количество гостей", ky: "Конокторду азайтуу" },
    increase: { ru: "Увеличить количество гостей", ky: "Конокторду көбөйтүү" },
    submit: { ru: "Отправить ответ", ky: "Жоопту жөнөтүү" },
    submitting: { ru: "Отправляем…", ky: "Жөнөтүлүүдө…" },
    retry: { ru: "Отправить ещё раз", ky: "Кайра жөнөтүү" },
    errorName: {
      ru: "Пожалуйста, укажите имя и фамилию.",
      ky: "Сураныч, атыңызды жана фамилияңызды жазыңыз.",
    },
    errorAttendance: {
      ru: "Пожалуйста, выберите ответ.",
      ky: "Сураныч, жообуңузду тандаңыз.",
    },
    errorGuests: {
      ru: "Укажите от 1 до 20 гостей.",
      ky: "1ден 20га чейин конок көрсөтүңүз.",
    },
    errorNetwork: {
      ru: "Не удалось отправить ответ. Проверьте соединение и попробуйте ещё раз.",
      ky: "Жооп жөнөтүлбөй калды. Байланышты текшерип, кайра аракет кылыңыз.",
    },
    errorServer: {
      ru: "Ответ не сохранился. Пожалуйста, попробуйте ещё раз.",
      ky: "Жооп сакталган жок. Сураныч, кайра аракет кылыңыз.",
    },
    errorConfig: {
      ru: "Форма ответов пока не настроена. Пожалуйста, сообщите организаторам.",
      ky: "Жооп берүү кызматы азырынча даяр эмес. Сураныч, уюштуруучуларга кабарлаңыз.",
    },
    successYes: {
      ru: "Спасибо! Будем рады видеть вас на нашем торжестве.",
      ky: "Рахмат! Сизди салтанатыбызда көрүүгө кубанычтабыз.",
    },
    successNo: {
      ru: "Спасибо, что сообщили. Нам будет вас не хватать.",
      ky: "Кабар бергениңизге рахмат. Тойдо сизди күткөн элек.",
    },
    changeAnswer: { ru: "Изменить ответ", ky: "Жоопту өзгөртүү" },
  },

  a11y: {
    skipToContent: { ru: "Перейти к содержанию", ky: "Мазмунга өтүү" },
    envelope: {
      ru: "Конверт с приглашением",
      ky: "Чакыруу салынган конверт",
    },
  },
} as const;
