"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { has, t, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";

/**
 * Kyz Uzatuu honours one person, so this is a single centred medallion rather
 * than the two columns a wedding template would use — the layout stays
 * balanced without any groom content.
 *
 * `InvitationMessage` renders this between the lead line and the closing
 * sentence, so the medallion is the name *inside* that sentence rather than a
 * section of its own — it carries no heading and no background band. Her
 * parents come from `BrideParents` after the sentence has finished, since a
 * parents line under the name would cut it in half.
 */
export function CoupleSection({ language }: { language: Language }) {
  const { bride } = invitation.people;

  return (
    <div className="bride">
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
    </div>
  );
}

/** The bride's parents, shown once the invitation sentence has finished. */
export function BrideParents({ language }: { language: Language }) {
  const { bride } = invitation.people;
  if (!has(bride.parents, language)) return null;

  return (
    <Reveal className="stack-center">
      <div className="bride__parents">
        <span className="bride__parents-label">
          {t(templateContent.bride.parentsLabel, language)}
        </span>
        <span className="bride__parents-value">{t(bride.parents, language)}</span>
      </div>
    </Reveal>
  );
}
