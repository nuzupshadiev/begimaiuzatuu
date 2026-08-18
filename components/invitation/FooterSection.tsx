"use client";

import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { longDate, parseEventDate } from "@/lib/date";
import { PriglasiCredit } from "./PriglasiCredit";

export function FooterSection({ language }: { language: Language }) {
  const date = parseEventDate(invitation.event.date);

  return (
    <footer className="footer">
      <div className="shell">
        <p className="footer__farewell">
          {t(templateContent.footer.farewell, language)}
        </p>
        <hr className="footer__rule" />
        <p className="footer__meta">
          {`${t(templateContent.eventName, language)} · ${longDate(date, language)}`}
        </p>
      </div>
      <PriglasiCredit language={language} />
    </footer>
  );
}
