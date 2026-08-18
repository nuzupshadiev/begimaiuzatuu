"use client";

import { useSyncExternalStore } from "react";
import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import { readClock, readServerClock, subscribeToClock } from "@/lib/clock";
import { countdownFrom, eventTimestamp, pluralize } from "@/lib/date";

const target = eventTimestamp(invitation.event.date, invitation.event.startTime);

/**
 * Counts down to the Bishkek start time. The clock is read through
 * `useSyncExternalStore`, so the server renders zeros, the browser fills them
 * in on the first tick, and hydration never mismatches.
 */
export function Countdown({ language }: { language: Language }) {
  const now = useSyncExternalStore(subscribeToClock, readClock, readServerClock);
  const started = now > 0;
  const parts = countdownFrom(target, started ? now : target);

  const units = [
    { value: parts.days, forms: translations.countdown.days[language] },
    { value: parts.hours, forms: translations.countdown.hours[language] },
    { value: parts.minutes, forms: translations.countdown.minutes[language] },
    { value: parts.seconds, forms: translations.countdown.seconds[language] },
  ];

  return (
    <section className="section section--warm" aria-labelledby="countdown-heading">
      <div className="shell stack-center">
        <h2 id="countdown-heading" className="heading">
          {t(templateContent.countdown.heading, language)}
        </h2>

        {started && parts.finished ? (
          <p className="countdown__finished" style={{ marginTop: "1.4rem" }}>
            {t(translations.countdown.finished, language)}
          </p>
        ) : (
          <div className="countdown__grid">
            {units.map((unit) => (
              <div className="countdown__cell" key={unit.forms[0]}>
                <span className="countdown__value">
                  {started ? unit.value : "–"}
                </span>
                <span className="countdown__unit">
                  {pluralize(unit.value, unit.forms, language)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
