"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { has, t, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";

/**
 * Kyz Uzatuu honours one person, so this is a single centred medallion rather
 * than the two columns a wedding template would use — the layout stays
 * balanced without any groom content, and the parents line disappears
 * entirely when the admin leaves it empty.
 */
export function CoupleSection({ language }: { language: Language }) {
  const { bride } = invitation.people;
  const showParents = has(bride.parents, language);

  return (
    <section className="section section--warm bride" aria-labelledby="bride-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center">
          <h2 id="bride-heading" className="heading">
            {t(templateContent.bride.heading, language)}
          </h2>

          <div className="bride__medallion">
            <Image
              className="bride__lace"
              src={templateAssets.lace.src}
              alt=""
              width={templateAssets.lace.width}
              height={templateAssets.lace.height}
              sizes="(min-width: 64rem) 30rem, (min-width: 48rem) 24rem, 90vw"
            />
            <p className="bride__inner">
              <span className="script bride__name">
                {t(bride.name, language)}
                {t(templateContent.message.nameSuffix, language)}
              </span>
            </p>
          </div>

          {showParents ? (
            <div className="bride__parents">
              <span className="bride__parents-label">
                {t(templateContent.bride.parentsLabel, language)}
              </span>
              <span className="bride__parents-value">
                {t(bride.parents, language)}
              </span>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
