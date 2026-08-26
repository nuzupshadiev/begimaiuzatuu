"use client";

import { templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { SprigIcon } from "./icons";
import { PriglasiCredit } from "./PriglasiCredit";

/** The botanical sprig, the guests' message, and the Priglasi credit row. */
export function FooterSection({ language }: { language: Language }) {
  return (
    <footer className="footer">
      <div className="shell">
        <p className="footer__sprig" aria-hidden="true">
          <SprigIcon />
        </p>
        <p className="footer__farewell">
          {t(templateContent.footer.farewell, language)}
        </p>
      </div>
      <PriglasiCredit language={language} />
    </footer>
  );
}
