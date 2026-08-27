"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { has, t, type Language } from "@/data/translations";
import { CoupleSection } from "./CoupleSection";
import { Reveal } from "./Reveal";
import { SprigIcon } from "./icons";
import { splitBrideMessage } from "@/lib/bride-message";

/**
 * The invitation itself, framed by the watercolour blossom branches: the
 * address to the guests, the line that introduces the bride, her name in the
 * lace medallion, the sentence her family closes on, and their signature.
 *
 * Kyrgyz finishes that sentence in the closing paragraph; Russian finishes it
 * on the name, so it carries no closing text and the paragraph is skipped.
 */
export function InvitationMessage({ language }: { language: Language }) {
  const { lead, rest } = splitBrideMessage(
    t(invitation.weddingDetails.customMessage, language),
  );
  const closing = rest
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const hosts = invitation.weddingDetails.hosts;

  return (
    <section className="section message" aria-labelledby="message-heading">
      <Image
        className="botanical botanical--branch-tl"
        src={templateAssets.blossomBranch.src}
        alt=""
        width={templateAssets.blossomBranch.width}
        height={templateAssets.blossomBranch.height}
        sizes="(min-width: 48rem) 14rem, 34vw"
      />
      <Image
        className="botanical botanical--cluster-bl"
        src={templateAssets.blossomCluster.src}
        alt=""
        width={templateAssets.blossomCluster.width}
        height={templateAssets.blossomCluster.height}
        sizes="(min-width: 48rem) 10rem, 26vw"
      />

      <div className="shell stack-center">
        <Reveal className="stack-center">
          <h2 id="message-heading" className="heading message__heading">
            {t(templateContent.message.heading, language)}
          </h2>

          {lead ? (
            <div className="message__body">
              <p>{lead}</p>
            </div>
          ) : null}
        </Reveal>

        <CoupleSection language={language} />

        {closing.length > 0 ? (
          <Reveal className="stack-center">
            <div className="message__body">
              {closing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {has(hosts, language) ? (
          <Reveal className="stack-center">
            <p className="message__hosts-label">
              {t(templateContent.message.hostsLabel, language)}
            </p>
            <p className="script message__hosts">{t(hosts, language)}</p>
          </Reveal>
        ) : null}

        <Reveal className="stack-center">
          <p className="sprig" aria-hidden="true" style={{ marginTop: "1.5rem" }}>
            <SprigIcon />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
