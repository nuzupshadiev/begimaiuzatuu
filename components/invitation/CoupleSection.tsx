"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { splitBrideMessage } from "@/lib/bride-message";

/**
 * Kyz Uzatuu honours one person, so this is a single centred medallion rather
 * than the two columns a wedding template would use — the layout stays
 * balanced without any groom content.
 *
 * `InvitationMessage` renders this between the lead line and the closing
 * sentence, so the medallion is the name *inside* that sentence rather than a
 * section of its own — it carries no heading and no background band. Her
 * hosts sign the invitation off at the end of the message, so no signature
 * line is placed under the name where it would cut that sentence in half.
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
            {splitBrideMessage(
              t(invitation.weddingDetails.customMessage, language),
            ).suffix}
          </span>
        </p>
      </div>
    </div>
  );
}
