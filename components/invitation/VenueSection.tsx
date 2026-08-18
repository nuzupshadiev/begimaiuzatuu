"use client";

import Image from "next/image";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { has, t, translations, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";

/** Where the evening happens, with the map link the admin supplies. */
export function VenueSection({ language }: { language: Language }) {
  const { venue } = invitation;
  const mapUrl = venue.mapUrl.trim();

  return (
    <section className="section section--mist" aria-labelledby="venue-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center">
          <h2 id="venue-heading" className="heading">
            {t(templateContent.venue.heading, language)}
          </h2>

          <Image
            className="venue__sketch"
            src={templateAssets.venueSketch.src}
            alt=""
            width={templateAssets.venueSketch.width}
            height={templateAssets.venueSketch.height}
            sizes="(min-width: 48rem) 30rem, 90vw"
          />

          {has(venue.name, language) ? (
            <p className="venue__name">{t(venue.name, language)}</p>
          ) : null}

          {has(venue.address, language) ? (
            <p className="venue__address">{t(venue.address, language)}</p>
          ) : null}

          {mapUrl ? (
            <p className="venue__actions">
              <a
                className="button button--outline"
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(translations.venue.mapButton, language)}
              </a>
              <span className="venue__hint">
                {t(translations.venue.mapHint, language)}
              </span>
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
