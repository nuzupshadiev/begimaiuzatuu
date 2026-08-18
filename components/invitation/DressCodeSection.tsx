"use client";

import { invitation } from "@/data/invitation";
import { templateContent } from "@/data/template-content";
import { has, t, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";

/** Rendered only when the invitation actually carries a dress code. */
export function DressCodeSection({ language }: { language: Language }) {
  const dressCode = invitation.weddingDetails.dressCode;
  if (!has(dressCode, language)) return null;

  return (
    <section className="section" aria-labelledby="dress-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center">
          <h2 id="dress-heading" className="heading">
            {t(templateContent.dressCode.heading, language)}
          </h2>

          <ul className="dress__swatches">
            {templateContent.dressCode.palette.map((swatch) => (
              <li className="dress__swatch" key={swatch.color}>
                <span
                  className="dress__chip"
                  style={{ background: swatch.color }}
                  aria-hidden="true"
                />
                {t(swatch, language)}
              </li>
            ))}
          </ul>

          <p className="dress__text">{t(dressCode, language)}</p>
          <p className="lede" style={{ marginTop: "0.75rem" }}>
            {t(templateContent.dressCode.note, language)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
