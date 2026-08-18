/**
 * Date and time helpers for the invitation.
 *
 * `event.date` is a plain calendar date (`YYYY-MM-DD`) and `event.startTime` a
 * wall-clock time (`HH:mm`) in Bishkek. Everything here parses those fields
 * field-by-field instead of handing them to `new Date(string)`, so a browser in
 * a western timezone can never render the previous day.
 */
import type { Language } from "@/data/translations";

/** Kyz Uzatuu invitations are timed against Kyrgyzstan's fixed UTC+6 offset. */
export const EVENT_UTC_OFFSET = "+06:00";

const MONTHS_NOMINATIVE: Record<Language, readonly string[]> = {
  ru: [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
  ],
  ky: [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
  ],
};

const MONTHS_GENITIVE: Record<Language, readonly string[]> = {
  ru: [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ],
  ky: [
    "январы", "февралы", "марты", "апрели", "майы", "июну",
    "июлу", "августу", "сентябры", "октябры", "ноябры", "декабры",
  ],
};

/** Index 0 is Sunday, matching `Date.prototype.getUTCDay()`. */
const WEEKDAYS: Record<Language, readonly string[]> = {
  ru: [
    "воскресенье", "понедельник", "вторник", "среда",
    "четверг", "пятница", "суббота",
  ],
  ky: [
    "жекшемби", "дүйшөмбү", "шейшемби", "шаршемби",
    "бейшемби", "жума", "ишемби",
  ],
};

export interface CalendarDate {
  year: number;
  /** 1-12. */
  month: number;
  /** 1-31. */
  day: number;
}

export function parseEventDate(isoDate: string): CalendarDate {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
}

export function parseStartTime(time: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

/** "17:00" + 105 → "18:45". Wraps around midnight for a late programme. */
export function addMinutes(time: string, offsetMinutes: number): string {
  const { hours, minutes } = parseStartTime(time);
  const total = (hours * 60 + minutes + offsetMinutes) % (24 * 60);
  const normalized = (total + 24 * 60) % (24 * 60);
  const paddedHours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const paddedMinutes = String(normalized % 60).padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}`;
}

/**
 * The event instant, anchored to Bishkek time so the countdown ends at the
 * intended local moment no matter where the guest is.
 */
export function eventTimestamp(isoDate: string, startTime: string): number {
  return Date.parse(`${isoDate}T${startTime}:00${EVENT_UTC_OFFSET}`);
}

/** Weekday index (0 = Sunday) of a calendar date, computed without local time. */
export function weekdayIndex({ year, month, day }: CalendarDate): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function weekdayName(date: CalendarDate, language: Language): string {
  return WEEKDAYS[language][weekdayIndex(date)];
}

export function monthName(month: number, language: Language): string {
  return MONTHS_NOMINATIVE[language][month - 1];
}

export function monthNameGenitive(month: number, language: Language): string {
  return MONTHS_GENITIVE[language][month - 1];
}

/** "12 сентября 2026" / "2026-жылдын 12-сентябры". */
export function longDate(date: CalendarDate, language: Language): string {
  if (language === "ky") {
    return `${date.year}-жылдын ${date.day}-${monthNameGenitive(date.month, "ky")}`;
  }
  return `${date.day} ${monthNameGenitive(date.month, "ru")} ${date.year}`;
}

/** "12.09.2026" — the compact form printed under the hero. */
export function numericDate(date: CalendarDate): string {
  const day = String(date.day).padStart(2, "0");
  const month = String(date.month).padStart(2, "0");
  return `${day}.${month}.${date.year}`;
}

/** "Сентябрь 2026 г." / "Сентябрь 2026-жыл" — the calendar caption. */
export function monthYearTitle(date: CalendarDate, language: Language): string {
  const month = capitalize(monthName(date.month, language));
  return language === "ky"
    ? `${month} ${date.year}-жыл`
    : `${month} ${date.year} г.`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * A Monday-first month grid. `null` marks the leading blanks before day 1;
 * trailing blanks pad the last week so the grid keeps a rectangular shape.
 */
export function monthGrid({ year, month }: CalendarDate): Array<number | null> {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const leadingBlanks = (firstWeekday + 6) % 7;
  const cells: Array<number | null> = Array.from(
    { length: leadingBlanks },
    () => null,
  );
  for (let day = 1; day <= daysInMonth(year, month); day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Russian needs one/few/many forms; Kyrgyz uses a single form. */
export function pluralize(
  count: number,
  forms: readonly string[],
  language: Language,
): string {
  if (language === "ky") return forms[0];
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

export function countdownFrom(target: number, now: number): CountdownParts {
  const remaining = Math.max(0, target - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: remaining === 0,
  };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
