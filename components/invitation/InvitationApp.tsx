"use client";

import { useCallback, useEffect, useState } from "react";
import { invitation } from "@/data/invitation";
import {
  DEFAULT_LANGUAGE,
  t,
  translations,
  type Language,
} from "@/data/translations";
import { Countdown } from "./Countdown";
import { CoupleSection } from "./CoupleSection";
import { DateSection } from "./DateSection";
import { DressCodeSection } from "./DressCodeSection";
import { FooterSection } from "./FooterSection";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { HostsSection } from "./HostsSection";
import { IntroScreen } from "./IntroScreen";
import { InvitationMessage } from "./InvitationMessage";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MusicControl, useBackgroundMusic } from "./MusicControl";
import { RsvpSection } from "./RsvpSection";
import { ScheduleSection } from "./ScheduleSection";
import { VenueSection } from "./VenueSection";

const musicSrc = invitation.media.music.trim() || null;

type IntroState = "open" | "closing" | "done";

/**
 * Holds the two pieces of page-wide state — the chosen language and whether
 * the envelope has been opened — and keeps `<html lang>` in step. Every
 * section re-renders from the same language value, so there is no duplicated
 * per-language page.
 */
export function InvitationApp() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [intro, setIntro] = useState<IntroState>("open");
  const music = useBackgroundMusic(musicSrc);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // The invitation is rendered underneath the intro from the first paint, so
  // scrolling is held back until the guest opens it.
  useEffect(() => {
    if (intro === "done") return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [intro]);

  const finishIntro = useCallback(() => setIntro("done"), []);

  const openInvitation = useCallback(() => {
    setIntro((current) => (current === "open" ? "closing" : current));
    // The button press is the user gesture browsers require before audio.
    music.start();
  }, [music]);

  return (
    <div className="page">
      <a className="skip-link" href="#invitation-content">
        {t(translations.a11y.skipToContent, language)}
      </a>

      <div className="controls">
        <LanguageSwitcher language={language} onChange={setLanguage} />
        <MusicControl music={music} language={language} />
      </div>

      {intro === "done" ? null : (
        <IntroScreen
          language={language}
          closing={intro === "closing"}
          onOpen={openInvitation}
          onFinished={finishIntro}
        />
      )}

      <main id="invitation-content">
        <HeroSection language={language} />
        <InvitationMessage language={language} />
        <CoupleSection language={language} />
        <DateSection language={language} />
        <Countdown language={language} />
        <ScheduleSection language={language} />
        <VenueSection language={language} />
        <GallerySection language={language} />
        <DressCodeSection language={language} />
        <RsvpSection language={language} />
        <HostsSection language={language} />
      </main>

      <FooterSection language={language} />
    </div>
  );
}
