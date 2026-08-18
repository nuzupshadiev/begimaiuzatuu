"use client";

import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { addMinutes } from "@/lib/date";
import { Reveal } from "./Reveal";
import { ScheduleIconGlyph } from "./icons";

/**
 * The evening's programme. Every row is an offset from
 * `invitation.event.startTime`, so a customer's own start hour shifts the whole
 * schedule without any per-invitation editing.
 */
export function ScheduleSection({ language }: { language: Language }) {
  const items = templateContent.schedule.items;
  if (items.length === 0) return null;

  return (
    <section className="section" aria-labelledby="schedule-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center" >
          <h2 id="schedule-heading" className="heading">
            {t(templateContent.schedule.heading, language)}
          </h2>

          <ol className="schedule__list">
            {items.map((item) => (
              <li className="schedule__item" key={item.offsetMinutes}>
                <span className="schedule__icon" aria-hidden="true">
                  <ScheduleIconGlyph name={item.icon} />
                </span>
                <span className="schedule__time">
                  {addMinutes(invitation.event.startTime, item.offsetMinutes)}
                </span>
                <span className="schedule__title">{t(item.title, language)}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
