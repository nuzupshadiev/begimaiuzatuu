"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { has, t, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";
import { SprigIcon } from "./icons";

/** The hosts' own words, framed by the watercolour blossom branches. */
export function InvitationMessage({ language }: { language: Language }) {
  const message = invitation.weddingDetails.customMessage;
  if (!has(message, language)) return null;

  const paragraphs = t(message, language)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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

          <div className="message__body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="sprig" aria-hidden="true" style={{ marginTop: "1.5rem" }}>
            <SprigIcon />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
