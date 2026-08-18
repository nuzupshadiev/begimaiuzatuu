"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { has, t, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";

/** Who is inviting — sealed with the botanical wax stamp. */
export function HostsSection({ language }: { language: Language }) {
  const hosts = invitation.weddingDetails.hosts;
  if (!has(hosts, language)) return null;

  return (
    <section className="section section--warm" aria-labelledby="hosts-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center">
          <Image
            className="hosts__seal"
            src={templateAssets.waxSeal.src}
            alt=""
            width={templateAssets.waxSeal.width}
            height={templateAssets.waxSeal.height}
            sizes="(min-width: 48rem) 6.5rem, 20vw"
          />

          <h2 id="hosts-heading" className="heading">
            {t(templateContent.hosts.heading, language)}
          </h2>

          <p className="script hosts__value">{t(hosts, language)}</p>
        </Reveal>
      </div>
    </section>
  );
}
