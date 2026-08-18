"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { t, translations, type Language } from "@/data/translations";

export interface BackgroundMusic {
  /** True only once a real audio file has been found at `src`. */
  readonly available: boolean;
  readonly playing: boolean;
  /** Starts playback after a user gesture; ignored if already playing. */
  readonly start: () => void;
  readonly toggle: () => void;
}

/**
 * Owns the single `Audio` element for the page.
 *
 * The object is created lazily in a ref, so nothing is downloaded before the
 * guest opens the invitation and React re-renders never restart the track. A
 * `HEAD` request decides whether a track ships at all: when the deployment has
 * no audio file the control never appears, and everything else keeps working.
 */
export function useBackgroundMusic(src: string | null): BackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    const controller = new AbortController();
    fetch(src, { method: "HEAD", signal: controller.signal })
      .then((response) => setAvailable(response.ok))
      .catch(() => {
        /* Missing track, offline, or aborted — the control stays hidden. */
      });
    return () => controller.abort();
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const play = useCallback(() => {
    if (!src) return;

    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "none";
      audio.addEventListener("play", () => setPlaying(true));
      audio.addEventListener("pause", () => setPlaying(false));
      audio.addEventListener("error", () => {
        setPlaying(false);
        setAvailable(false);
      });
      audioRef.current = audio;
    }

    // Autoplay can still be refused; the invitation is fine without sound.
    void audioRef.current.play().catch(() => setPlaying(false));
  }, [src]);

  const start = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) return;
    play();
  }, [play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      return;
    }
    play();
  }, [play]);

  return { available, playing, start, toggle };
}

/** Round play/pause button pinned beside the language switch. */
export function MusicControl({
  music,
  language,
}: {
  music: BackgroundMusic;
  language: Language;
}) {
  if (!music.available) return null;

  const label = music.playing
    ? t(translations.music.pause, language)
    : t(translations.music.play, language);

  return (
    <span className="music-button__shell">
      <button
        type="button"
        className="music-button"
        onClick={music.toggle}
        aria-label={label}
        aria-pressed={music.playing}
      >
        <span className="music-button__wave" aria-hidden="true" />
        {music.playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="7" y="5" width="3.4" height="14" rx="1.2" />
            <rect x="13.6" y="5" width="3.4" height="14" rx="1.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.4v13.2L19 12z" />
          </svg>
        )}
      </button>
    </span>
  );
}
