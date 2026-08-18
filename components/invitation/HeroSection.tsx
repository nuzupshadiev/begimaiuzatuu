"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { numericDate, parseEventDate, weekdayName } from "@/lib/date";

/**
 * The photograph fills the first screen as a backdrop — decorative only, so it
 * is hidden from assistive technology — with the engraved ornament sheet laid
 * over it and the bride's name set in script above the date.
 */
export function HeroSection({ language }: { language: Language }) {
  const date = parseEventDate(invitation.event.date);

  return (
    <header className="hero">
      <div className="hero__photo">
        <Image
          src={templateAssets.garden.src}
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__ornament" aria-hidden="true">
        <Image
          src={templateAssets.ornamentLight.src}
          alt=""
          width={templateAssets.ornamentLight.width}
          height={templateAssets.ornamentLight.height}
          sizes="100vw"
        />
      </div>

      <Image
        className="hero__dove"
        src={templateAssets.dove.src}
        alt=""
        width={templateAssets.dove.width}
        height={templateAssets.dove.height}
        priority
        sizes="(min-width: 48rem) 10rem, 26vw"
      />

      <div className="hero__content">
        <p className="eyebrow">{t(templateContent.hero.eyebrow, language)}</p>

        <h1 className="script hero__name">
          {t(invitation.people.bride.name, language)}
        </h1>

        <p className="hero__date">
          <span>{numericDate(date)}</span>
          <i aria-hidden="true" />
          <span>{weekdayName(date, language)}</span>
        </p>

        {/* <p className="hero__note">{t(templateContent.hero.note, language)}</p> */}
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}
