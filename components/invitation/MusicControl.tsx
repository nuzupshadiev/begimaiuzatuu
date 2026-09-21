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
  // Set only by the hidden-tab pause below, never by the guest's own.
  const pausedByHiddenTab = useRef(false);
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
    if (!src) return;

    // Created on mount and buffered ahead of the tap, so play starts
    // instantly instead of waiting on a fetch.
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("error", () => {
      setPlaying(false);
      setAvailable(false);
    });
    audioRef.current = audio;

    // A tab the guest has left falls silent, and the track picks up where it
    // stopped when they come back — but only when the tab is what stopped it.
    // Resuming plays the element directly, so the music never starts over.
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (audio.paused) return;
        pausedByHiddenTab.current = true;
        audio.pause();
        return;
      }
      if (!pausedByHiddenTab.current) return;
      pausedByHiddenTab.current = false;
      void audio.play().catch(() => setPlaying(false));
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Browsers defer media fetches until playback starts, which made the first
    // tap wait a few seconds on the network. Download the track ourselves and
    // hand the element a local copy, so the tap starts the music instantly.
    // Until the copy lands (or if the fetch fails) the plain URL still plays.
    let objectUrl: string | null = null;
    const prefetch = new AbortController();
    fetch(src, { signal: prefetch.signal })
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (!blob || audioRef.current !== audio) return;
        objectUrl = URL.createObjectURL(blob);
        // A swap mid-play would restart the track; the network copy is fine.
        // A track the hidden tab paused counts as mid-play.
        if (audio.paused && !pausedByHiddenTab.current) audio.src = objectUrl;
      })
      .catch(() => {});

    return () => {
      prefetch.abort();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.pause();
      audioRef.current = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Autoplay can still be refused; the invitation is fine without sound.
    void audio.play().catch(() => setPlaying(false));
  }, []);

  const start = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) return;
    play();
  }, [play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    // A deliberate press always takes over from the hidden-tab pause.
    pausedByHiddenTab.current = false;
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
