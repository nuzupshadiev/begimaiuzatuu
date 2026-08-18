"use client";

import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import {
  monthGrid,
  monthName,
  monthYearTitle,
  parseEventDate,
  weekdayName,
} from "@/lib/date";
import { Reveal } from "./Reveal";

/** The day itself: large numerals, then the month grid with the day marked. */
export function DateSection({ language }: { language: Language }) {
  const date = parseEventDate(invitation.event.date);
  const cells = monthGrid(date);
  const weekdays = translations.calendar.weekdays[language];

  return (
    <section className="section" aria-labelledby="date-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center">
          <h2 id="date-heading" className="heading">
            {t(templateContent.date.heading, language)}
          </h2>

          <p className="date__display">
            <span className="date__part">{weekdayName(date, language)}</span>
            <span className="date__day">{date.day}</span>
            <span className="date__stack">
              <span className="date__part">{monthName(date.month, language)}</span>
              <span className="date__part">{date.year}</span>
            </span>
          </p>

          <div className="calendar">
            <p className="calendar__caption">{monthYearTitle(date, language)}</p>

            <div className="calendar__grid" role="presentation">
              {weekdays.map((weekday) => (
                <span key={weekday} className="calendar__weekday">
                  {weekday}
                </span>
              ))}

              {cells.map((day, index) => {
                if (day === null) {
                  return <span key={`blank-${index}`} className="calendar__cell" />;
                }
                const isEventDay = day === date.day;
                return (
                  <span
                    key={day}
                    className={
                      isEventDay
                        ? "calendar__cell calendar__cell--event"
                        : "calendar__cell"
                    }
                  >
                    {day}
                    {isEventDay ? (
                      <span className="sr-only">
                        {` — ${t(translations.calendar.eventDay, language)}`}
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </div>

            <p className="calendar__legend">
              <i aria-hidden="true" />
              {`${t(translations.calendar.startsAt, language)} ${invitation.event.startTime}`}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
