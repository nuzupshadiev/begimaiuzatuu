"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { invitation } from "@/data/invitation";
import { templateAssets, templateContent } from "@/data/template-content";
import { t, translations, type Language } from "@/data/translations";
import { longDate, parseEventDate } from "@/lib/date";

/**
 * The envelope the guest opens first.
 *
 * It covers the invitation rather than replacing it: the page underneath is in
 * the DOM from the first paint, so search engines and assistive technology see
 * the whole invitation even before the button is pressed. Opening it is also
 * the user gesture that background music is allowed to start from.
 */
export function IntroScreen({
  language,
  closing,
  onOpen,
  onFinished,
}: {
  language: Language;
  closing: boolean;
  onOpen: () => void;
  onFinished: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // `transitionend` is the normal signal, but it never arrives if the browser
  // skips the animation. The timer guarantees the overlay is removed and the
  // page becomes scrollable either way.
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onFinished, 900);
    return () => window.clearTimeout(timer);
  }, [closing, onFinished]);

  const date = parseEventDate(invitation.event.date);

  return (
    <div
      className={closing ? "intro intro--closing" : "intro"}
      role="dialog"
      aria-modal="true"
      aria-label={t(translations.intro.open, language)}
      aria-hidden={closing || undefined}
      onTransitionEnd={(event) => {
        if (event.propertyName === "opacity" && closing) onFinished();
      }}
    >
      <div className="intro__photo">
        <Image
          src={templateAssets.garden.src}
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="intro__veil" aria-hidden="true" />

      <div className="intro__card">
        <Image
          className="intro__frame"
          src={templateAssets.ornamentOlive.src}
          alt=""
          width={templateAssets.ornamentOlive.width}
          height={templateAssets.ornamentOlive.height}
          priority
          sizes="(min-width: 48rem) 23rem, 88vw"
        />

        <p className="eyebrow">{t(templateContent.intro.eyebrow, language)}</p>

        <Image
          className="intro__envelope"
          src={templateAssets.envelope.src}
          alt={t(translations.a11y.envelope, language)}
          width={templateAssets.envelope.width}
          height={templateAssets.envelope.height}
          priority
          sizes="(min-width: 48rem) 12.5rem, 42vw"
        />

        <p className="script intro__name">
          {t(invitation.people.bride.name, language)}
        </p>

        <p className="date__part">{longDate(date, language)}</p>

        <button
          ref={buttonRef}
          type="button"
          className="button"
          onClick={onOpen}
          disabled={closing}
        >
          {t(translations.intro.open, language)}
        </button>

        <p className="intro__hint">{t(templateContent.intro.note, language)}</p>
      </div>
    </div>
  );
}
